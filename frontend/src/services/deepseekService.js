const DEEPSEEK_API_KEY = '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';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const systemPrompt = `You are an AI assistant for SchedEx, a viva scheduling system. 
You help users with scheduling, rescheduling, and managing vivas. 
Respond professionally and concisely. For scheduling requests, always ask for specific date and time.
Current features: schedule viva, reschedule viva, view schedule, set availability.`;

export const generateResponse = async (userMessage) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      intent: detectIntent(data.choices[0].message.content),
      suggestions: generateSuggestions(data.choices[0].message.content)
    };
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw error;
  }
};

// Helper function to detect intent from response
const detectIntent = (response) => {
  const lowerResponse = response.toLowerCase();
  if (lowerResponse.includes('schedule') || lowerResponse.includes('reschedule')) {
    return 'schedule_viva';
  }
  if (lowerResponse.includes('availability')) {
    return 'set_availability';
  }
  if (lowerResponse.includes('view') || lowerResponse.includes('show')) {
    return 'view_schedule';
  }
  return 'general';
};

// Helper function to generate contextual suggestions
const generateSuggestions = (response) => {
  const intent = detectIntent(response);
  switch (intent) {
    case 'schedule_viva':
      return [
        "Yes, schedule for this time",
        "Show other available slots",
        "Cancel scheduling"
      ];
    case 'set_availability':
      return [
        "Set weekly schedule",
        "Block specific dates",
        "View current availability"
      ];
    case 'view_schedule':
      return [
        "Show next week",
        "Show this month",
        "Reschedule a viva"
      ];
    default:
      return [
        "Schedule a viva",
        "View my schedule",
        "Set availability"
      ];
  }
}; 