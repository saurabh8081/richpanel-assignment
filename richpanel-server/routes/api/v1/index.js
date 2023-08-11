// ifacet/server/routes/api/v1/index.js
const express = require('express');
const userRoutes = require('./userRoutes');
const planRoutes = require('./planRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const invoiceRoutes = require('./invoiceRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/plans', planRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/invoices', invoiceRoutes);

module.exports = router;