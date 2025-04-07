export const initialMessages = [
  {
    type: "bot",
    text: "Hi! I'm Schedula AI, your scheduling assistant. How can I help you today?",
    timestamp: new Date(),
  },
  {
    type: "bot",
    text: "I can help you with:",
    options: [
      "Schedule a meeting",
      "Find available time slots",
      "Reschedule an event",
      "Check my calendar",
    ],
    timestamp: new Date(),
  },
];

export const getBotResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("schedule") && lowerMessage.includes("meeting")) {
    return {
      text: "I'll help you schedule a meeting. When would you like to schedule it for?",
      options: ["Today", "Tomorrow", "This week", "Next week"],
    };
  }
  if (
    lowerMessage.includes("available") ||
    lowerMessage.includes("time slot")
  ) {
    return {
      text: "I'll check your calendar for available time slots. Which day should I look at?",
      options: ["Today", "Tomorrow", "This week"],
    };
  }
  if (lowerMessage.includes("reschedule")) {
    return {
      text: "Sure, I can help you reschedule. Which event would you like to reschedule?",
      options: ["Team Meeting", "Project Review", "Client Call"],
    };
  }
  return {
    text:
      "I understand you're asking about: " +
      userMessage +
      ". Could you please provide more details?",
    options: ["Schedule meeting", "Find time", "Check calendar"],
  };
};
