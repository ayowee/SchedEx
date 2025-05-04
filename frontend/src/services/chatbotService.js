// Chatbot service to handle AI responses
// This is a simple implementation that could be expanded to use a real AI service

// Predefined responses based on user input
const responses = {
  // General queries
  general: [
    "How can I help you with SchedEx today?",
    "What specific features are you interested in?",
    "Is there anything specific about scheduling you'd like to know?",
    "I'm here to help with any questions about presentations or scheduling."
  ],
  
  // Student-specific queries
  student: [
    "You can view all your scheduled presentations on your dashboard.",
    "Need help finding your presentation schedule?",
    "You can check presentation details by clicking on any event in the calendar.",
    "Is there a specific presentation you're looking for?"
  ],
  
  // Examiner-specific queries
  examiner: [
    "You can manage your availability through the examiner dashboard.",
    "Need help setting your available time slots?",
    "You can view all your assigned presentations in the calendar.",
    "Would you like to know how to update your availability?"
  ],
  
  // Scheduling-related queries
  scheduling: [
    "SchedEx makes it easy to schedule presentations with automatic conflict detection.",
    "You can filter presentations by date, status, or examiner.",
    "Need help finding an available time slot?",
    "Would you like to know more about the scheduling process?"
  ],
  
  // Help-related queries
  help: [
    "I'm here to help! What specific issue are you facing?",
    "Could you provide more details about what you need help with?",
    "I can guide you through any SchedEx feature. What are you trying to do?",
    "Do you need technical support or just general information?"
  ]
};

// Suggestions based on user context
const suggestions = {
  student: [
    "View my presentations",
    "Check upcoming schedule",
    "Presentation details",
    "Contact my examiner"
  ],
  examiner: [
    "Update availability",
    "View assigned presentations",
    "Reschedule a presentation",
    "Submit evaluation"
  ],
  general: [
    "How to use SchedEx",
    "Technical support",
    "Feature questions",
    "Contact admin"
  ]
};

// Function to get a random response from a category
const getRandomResponse = (category) => {
  const categoryResponses = responses[category] || responses.general;
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  return categoryResponses[randomIndex];
};

// Function to analyze user input and determine appropriate response category
const analyzeInput = (input) => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('schedule') || lowerInput.includes('booking') || lowerInput.includes('slot') || lowerInput.includes('time')) {
    return 'scheduling';
  }
  
  if (lowerInput.includes('student') || lowerInput.includes('presentation') || lowerInput.includes('attend')) {
    return 'student';
  }
  
  if (lowerInput.includes('examiner') || lowerInput.includes('availability') || lowerInput.includes('evaluate')) {
    return 'examiner';
  }
  
  if (lowerInput.includes('help') || lowerInput.includes('support') || lowerInput.includes('issue') || lowerInput.includes('problem')) {
    return 'help';
  }
  
  return 'general';
};

// Get suggestions based on user type and previous interactions
const getSuggestions = (userType = 'general') => {
  // Return based on user type
  return suggestions[userType] || suggestions.general;
};

// Main function to get a response to user input
const getResponse = (input, userType = 'general') => {
  const category = analyzeInput(input);
  const response = getRandomResponse(category);
  const newSuggestions = getSuggestions(userType);
  
  return {
    text: response,
    suggestions: newSuggestions
  };
};

export default {
  getResponse,
  getSuggestions
};
