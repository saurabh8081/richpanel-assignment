const express = require('express');
const { register, login, getProfile, logout } = require('../../../controllers/api/v1/userController');
const auth = require('../../../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getProfile);
router.post('/logout', auth, logout);

module.exports = router;
