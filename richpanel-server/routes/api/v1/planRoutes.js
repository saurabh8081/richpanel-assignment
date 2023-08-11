const express = require('express');
const { plans } = require('../../../controllers/api/v1/planController');
const auth = require('../../../middleware/auth'); // You'll need to create this

const router = express.Router();

router.get('/plans', auth, plans);

module.exports = router;