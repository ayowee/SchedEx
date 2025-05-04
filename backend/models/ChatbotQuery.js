const mongoose = require('mongoose');

const ChatbotQuerySchema = new mongoose.Schema({
  userId: { 
    type: String,
    required: false 
  },
  userType: { 
    type: String, 
    enum: ['student', 'examiner', 'admin', 'guest'],
    default: 'guest'
  },
  query: { 
    type: String, 
    required: true 
  },
  intent: { 
    type: String, 
    enum: ['add_event', 'search_event', 'check_availability', 'general_info', 'help', 'other'],
    required: true 
  },
  parameters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  response: { 
    type: String, 
    required: true 
  },
  successful: { 
    type: Boolean, 
    default: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ChatbotQuery', ChatbotQuerySchema);
