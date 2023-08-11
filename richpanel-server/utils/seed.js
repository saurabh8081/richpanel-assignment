const Plan = require('../models/Plan');
const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_51NddRfSA42VdnRC4CTn3lCe0YKlecX2oly56ZoIzDzujgmqadeTr3v88rCyL3enVl4DT10ozUcy0QTMA06V7uyDj00GEtY38G9');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/richpanelDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to the database :: MongoDB");
    } catch (error) {
        console.error("Error connecting to the database :: MongoDB", error);
        process.exit(1);
    }
};
connectDB();

const createStripePlan = async (plan, interval, amount) => {
    try {
        const stripePlan = await stripe.plans.create({
            amount: amount * 100,
            currency: 'inr',
            interval: interval,
            product: { name: `${plan.planName} - ${interval}` },
        });

        return stripePlan.id;
    } catch (error) {
        console.error("Error creating Stripe plan:", error);
    }
};

const seedPlans = async () => {
    const newPlans = [];

    for (let plan of plans) {
        const stripePlanIdMonthly = await createStripePlan(plan, 'month', plan.monthlyPrice);
        const stripePlanIdYearly = await createStripePlan(plan, 'year', plan.yearlyPrice);

        newPlans.push({
            ...plan,
            stripePlanIdMonthly: stripePlanIdMonthly,
            stripePlanIdYearly: stripePlanIdYearly
        });
    }

    Plan.insertMany(newPlans)
        .then(() => {
            console.log('Data inserted');
            mongoose.connection.close();
        })
        .catch(error => {
            console.error('Error inserting data:', error);
        });
};

const plans = [
    {
        planName: 'Mobile',
        monthlyPrice: 100,
        yearlyPrice: 1000,
        videoQuality: 'Good',
        resolution: '480p',
        devices: 'Phone+Tablet',
        activeScreens: 1
    },
    {
        planName: 'Basic',
        monthlyPrice: 200,
        yearlyPrice: 2000,
        videoQuality: 'Good',
        resolution: '720p',
        devices: 'Phone+Tablet+Computer+TV',
        activeScreens: 3
    },
    {
        planName: 'Standard',
        monthlyPrice: 500,
        yearlyPrice: 5000,
        videoQuality: 'Better',
        resolution: '1080p',
        devices: 'Phone+Tablet+Computer+TV',
        activeScreens: 5
    },
    {
        planName: 'Premium',
        monthlyPrice: 700,
        yearlyPrice: 7000,
        videoQuality: 'Best',
        resolution: '4K+HDR',
        devices: 'Phone+Tablet+Computer+TV',
        activeScreens: 10
    }
];

seedPlans();
