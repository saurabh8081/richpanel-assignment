const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../../../models/Subscription');
const Plan = require('../../../models/Plan');  // Adjust the path accordingly
const User = require('../../../models/User');

exports.createSubscription = async (req, res) => {
    try {
        const { paymentMethodId, planName, billingCycle } = req.body;
        let customer;
        if (!req.user.stripeCustomerId) {
            customer = await stripe.customers.create({
                payment_method: paymentMethodId,
                email: req.user.email,
            });
            const user = await User.findById(req.user.id);
            user.stripeCustomerId = customer.id;
            await user.save();
        } else {
            customer = await stripe.customers.retrieve(req.user.stripeCustomerId);
        }

        const planDetails = await Plan.findOne({ planName: planName });
        if (!planDetails) {
            return res.status(404).send("Plan not found");
        }

        let stripePlanId;
        if (billingCycle === 'Monthly') {
            stripePlanId = planDetails.stripePlanIdMonthly;
        } else if (billingCycle === 'Yearly') {
            stripePlanId = planDetails.stripePlanIdYearly;
        } else {
            return res.status(400).send("Invalid billing cycle");
        }
        if (!stripePlanId) {
            return res.status(404).send("Stripe plan ID not found for the specified billing cycle");
        }

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: stripePlanId }],
            default_payment_method: paymentMethodId
        });

        if (subscription.status === "active" || subscription.status === "trialing") {
            const newSubscription = new Subscription({
                user: req.user.id,
                plan: planName,
                stripeSubscriptionId: subscription.id,
                startDate: new Date(subscription.current_period_start * 1000), // Convert from Unix timestamp to JS Date
                endDate: new Date(subscription.current_period_end * 1000),  // Convert from Unix timestamp to JS Date
                status: subscription.status
            });

            await newSubscription.save();
            return res.status(200).json({ success: true, subscription: newSubscription });

        } else if (subscription.status === "incomplete") {
            const newSubscription = new Subscription({
                user: req.user.id,
                plan: planDetails._id,
                stripeSubscriptionId: subscription.id,
                startDate: new Date(subscription.current_period_start * 1000),
                endDate: new Date(subscription.current_period_end * 1000),
                status: "incomplete"
            });
            await newSubscription.save();
            return res.status(402).json({ success: false, subscription, error: "Payment requires authentication." });
        }
        else {
            // Handle other statuses accordingly (e.g., past_due, canceled)
            return res.status(400).json({ success: false, error: "Subscription is not active." });
        }

    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).send("Internal Server Error");
    }
}

exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user.id });
        if (!subscription) {
            return res.status(404).send("No subscription found for this user");
        }

        // Cancel the subscription on Stripe's end
        await stripe.subscriptions.del(subscription.stripeSubscriptionId);

        // Update subscription status in your database to 'cancelled'
        subscription.status = 'cancelled';
        subscription.endDate = new Date();  // Optionally set an end date if you want to track when it was cancelled
        await subscription.save();

        res.status(200).send("Subscription successfully cancelled");
    } catch (error) {
        console.error("Error canceling subscription:", error);
        res.status(500).send("Internal Server Error");
    }
}

exports.getSubscriptionStatus = async (req, res) => {
    try {
        // Fetch subscription from your database
        const subscription = await Subscription.findOne({ user: req.user.id });

        if (!subscription) {
            return res.status(404).send("No subscription found for this user");
        }

        // Fetch subscription from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
        console.log(stripeSubscription);

        if (!stripeSubscription) {
            return res.status(404).send("No subscription found on Stripe for this user");
        }

        // Check if Stripe's subscription status is 'active' and update database
        if (stripeSubscription.status === 'active' && subscription.status !== 'active') {
            subscription.status = 'active';

            // Update the startDate and endDate from the stripeSubscription object
            subscription.startDate = new Date(stripeSubscription.current_period_start * 1000); 
            subscription.endDate = new Date(stripeSubscription.current_period_end * 1000);
            
            await subscription.save();
        } else if (subscription.status !== stripeSubscription.status) {  // handle other discrepancies 
            subscription.status = stripeSubscription.status;
            await subscription.save();
        }

        // Combine the statuses to provide a comprehensive view
        const response = {
            localStatus: subscription.status,  // Status from your database
            stripeStatus: stripeSubscription.status,  // Status from Stripe
            startDate: subscription.startDate,
            endDate: subscription.endDate
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching subscription status:", error);
        res.status(500).send("Internal Server Error");
    }
};