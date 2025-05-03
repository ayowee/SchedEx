const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/set-initial-password', authController.setInitialPassword);

module.exports = router;
