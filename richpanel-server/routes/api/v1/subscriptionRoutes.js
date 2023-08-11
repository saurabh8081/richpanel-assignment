const express = require('express');
const { 
    createSubscription, 
    getSubscriptionStatus, 
    cancelSubscription 
} = require('../../../controllers/api/v1/subscriptionController');
const auth = require('../../../middleware/auth'); 

const router = express.Router();

router.post('/create', auth, createSubscription);
router.post('/cancel', auth, cancelSubscription);
router.get('/status', auth, getSubscriptionStatus);

module.exports = router;
