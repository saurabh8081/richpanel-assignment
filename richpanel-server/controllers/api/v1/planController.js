const Plan = require('../../../models/Plan');

exports.plans = async (req, res) => {
    try {
        const plans = await Plan.find({});
        res.status(200).json(plans);
    } catch (err) {
        res.status(500).json({ msg: "Can't fetch plans!" });
    }
};