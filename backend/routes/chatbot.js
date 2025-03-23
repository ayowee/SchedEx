require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

router.post('/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.deepseek.ai/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a helpful scheduling assistant for SchedEx, a viva scheduling system. Keep responses concise and focused on scheduling tasks."
          },
          {
            role: "user",
            content: req.body.message
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('DeepSeek API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to get response from AI',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router; 

module.exports = router;
