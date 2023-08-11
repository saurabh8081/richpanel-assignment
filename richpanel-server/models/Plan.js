const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    planName: String,
    monthlyPrice: Number,
    yearlyPrice: Number,
    videoQuality: String,
    resolution: String,
    devices: String,
    activeScreens: Number,
    stripePlanIdMonthly: String,
    stripePlanIdYearly: String
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;