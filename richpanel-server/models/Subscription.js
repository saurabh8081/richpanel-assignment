const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    stripeSubscriptionId: String,
    status: {
        type: String,
        enum: ['active', 'cancelled', 'paused', 'incomplete'],
        default: 'active'
    },
    billingInterval: {
        type: String,
        enum: ['monthly', 'yearly'],
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
