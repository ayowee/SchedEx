import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5002/api/chatbot',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Schedula AI Assistant service
const schedulaService = {
  // Process a query through the AI assistant
  processQuery: async (query, userType = 'general', userId = null) => {
    try {
      const response = await api.post('/query', {
        query,
        userType,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  },

  // Get recent queries for a user
  getRecentQueries: async (userId, limit = 10) => {
    try {
      const response = await api.get(`/recent/${userId}/${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent queries:', error);
      throw error;
    }
  },

  // Extract entities from text (local processing for quick responses)
  extractEntities: (text) => {
    const entities = {
      date: extractDateFromText(text),
      time: extractTimeFromText(text),
      examiner: extractExaminerFromText(text),
      group: extractGroupFromText(text),
      location: extractLocationFromText(text)
    };
    
    return entities;
  }
};

// Helper functions for local entity extraction
const extractDateFromText = (text) => {
  // Simple date extraction
  const datePatterns = [
    // YYYY-MM-DD
    /(\d{4}-\d{2}-\d{2})/,
    // MM/DD/YYYY
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    // Tomorrow, next week, etc.
    /(tomorrow|next week|today)/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

const extractTimeFromText = (text) => {
  // Simple time extraction
  const timePatterns = [
    // HH:MM
    /(\d{1,2}:\d{2})/,
    // HH:MM AM/PM
    /(\d{1,2}:\d{2}\s*(am|pm))/i,
    // H AM/PM
    /(\d{1,2}\s*(am|pm))/i
  ];

  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

const extractExaminerFromText = (text) => {
  // Extract examiner name
  const examinerPattern = /examiner\s*(\w+(?:\s+\w+)*)/i;
  const match = text.match(examinerPattern);
  
  if (match) {
    return match[1].trim();
  }
  
  return null;
};

const extractGroupFromText = (text) => {
  // Extract group ID
  const groupPatterns = [
    // Group X
    /group\s*(\w+)/i,
    // Group ID X
    /group\s*id\s*(\w+)/i
  ];

  for (const pattern of groupPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

const extractLocationFromText = (text) => {
  // Extract location
  const locationPattern = /location\s*(?:is|at|in)?\s*(\w+(?:\s+\w+)*)/i;
  const match = text.match(locationPattern);
  
  if (match) {
    return match[1].trim();
  }
  
  return null;
};

export default schedulaService;
