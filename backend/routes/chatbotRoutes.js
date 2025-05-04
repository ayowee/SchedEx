const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Process a chatbot query
router.post('/query', chatbotController.processQuery);

// Get recent queries for a user
router.get('/recent/:userId/:limit?', chatbotController.getRecentQueries);

module.exports = router;
