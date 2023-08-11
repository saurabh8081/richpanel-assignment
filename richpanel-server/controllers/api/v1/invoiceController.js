const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Controllers are functions that handle HTTP requests. They often contain the logic for interacting with the database or other services.
const getInvoice = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;

        // Fetch the invoice from Stripe
        const invoice = await stripe.invoices.retrieve(invoiceId);

        // Return the invoice to the client
        res.status(200).json({ success: true, data: invoice });

    } catch (error) {
        console.error(error);
        if (error.type === 'StripeInvalidRequestError') {
            return res.status(400).json({ success: false, message: error.message });
        } else {
            return res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
};

module.exports = {
    getInvoice
};