const express = require('express');
const { getInvoice } = require('../../../controllers/api/v1/invoiceController');
const auth = require('../../../middleware/auth'); // You'll need to create this

const router = express.Router();

router.get('/:invoiceId', auth, getInvoice);

module.exports = router;