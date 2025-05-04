const ChatbotQuery = require('../models/ChatbotQuery');
const Presentation = require('../models/Presentation');
const ExaminerAvailability = require('../models/ExaminerAvailability');
const { parseISO, format, isValid } = require('date-fns');

// Natural language processing helper functions
const extractDateFromText = (text) => {
  // Simple date extraction - in production would use a more robust NLP library
  const datePatterns = [
    // YYYY-MM-DD
    /(\d{4}-\d{2}-\d{2})/,
    // MM/DD/YYYY
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    // Month DD, YYYY
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i,
    // Tomorrow, next week, etc.
    /(tomorrow|next week|next month|today)/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const dateStr = match[0];
      
      // Handle relative dates
      if (dateStr.toLowerCase() === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return format(tomorrow, 'yyyy-MM-dd');
      } else if (dateStr.toLowerCase() === 'today') {
        const today = new Date();
        return format(today, 'yyyy-MM-dd');
      } else if (dateStr.toLowerCase() === 'next week') {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return format(nextWeek, 'yyyy-MM-dd');
      } else if (dateStr.toLowerCase() === 'next month') {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return format(nextMonth, 'yyyy-MM-dd');
      }
      
      // Try to parse the date
      try {
        let parsedDate;
        if (dateStr.includes('/')) {
          // MM/DD/YYYY
          const [month, day, year] = dateStr.split('/');
          parsedDate = new Date(year, month - 1, day);
        } else if (dateStr.includes('-')) {
          // YYYY-MM-DD
          parsedDate = parseISO(dateStr);
        } else {
          // Month DD, YYYY
          parsedDate = new Date(dateStr);
        }
        
        if (isValid(parsedDate)) {
          return format(parsedDate, 'yyyy-MM-dd');
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
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
      const timeStr = match[0];
      
      // Try to parse the time
      try {
        let hours, minutes;
        
        if (timeStr.includes(':')) {
          // HH:MM or HH:MM AM/PM
          const timeParts = timeStr.split(':');
          hours = parseInt(timeParts[0], 10);
          
          if (timeParts[1].includes('am') || timeParts[1].includes('AM')) {
            if (hours === 12) hours = 0;
          } else if (timeParts[1].includes('pm') || timeParts[1].includes('PM')) {
            if (hours !== 12) hours += 12;
          }
          
          minutes = parseInt(timeParts[1].replace(/[^\d]/g, ''), 10);
        } else {
          // H AM/PM
          const isPM = timeStr.toLowerCase().includes('pm');
          hours = parseInt(timeStr.replace(/[^\d]/g, ''), 10);
          
          if (isPM && hours !== 12) {
            hours += 12;
          } else if (!isPM && hours === 12) {
            hours = 0;
          }
          
          minutes = 0;
        }
        
        // Format as HH:MM
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      } catch (error) {
        console.error('Error parsing time:', error);
      }
    }
  }
  
  return null;
};

const extractDurationFromText = (text) => {
  // Extract duration in minutes
  const durationPatterns = [
    // X minutes
    /(\d+)\s*minutes?/i,
    // X mins
    /(\d+)\s*mins?/i,
    // X hours
    /(\d+)\s*hours?/i,
    // X hr
    /(\d+)\s*hrs?/i
  ];

  for (const pattern of durationPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[0].toLowerCase();
      
      if (unit.includes('hour') || unit.includes('hr')) {
        return value * 60; // Convert hours to minutes
      } else {
        return value; // Already in minutes
      }
    }
  }
  
  return 30; // Default duration: 30 minutes
};

const extractGroupIdFromText = (text) => {
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

const extractExaminerFromText = (text) => {
  // Extract examiner name - in production would use a database lookup
  const examinerPattern = /examiner\s*(\w+(?:\s+\w+)*)/i;
  const match = text.match(examinerPattern);
  
  if (match) {
    return match[1].trim();
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

const extractSubjectFromText = (text) => {
  // Extract subject
  const subjectPattern = /subject\s*(?:is|on)?\s*(\w+(?:\s+\w+)*)/i;
  const match = text.match(subjectPattern);
  
  if (match) {
    return match[1].trim();
  }
  
  return null;
};

// Determine the intent of the user's query
const determineIntent = (query) => {
  const lowerQuery = query.toLowerCase();
  
  if (
    lowerQuery.includes('add') || 
    lowerQuery.includes('create') || 
    lowerQuery.includes('schedule') || 
    lowerQuery.includes('new presentation') ||
    lowerQuery.includes('book')
  ) {
    return 'add_event';
  }
  
  if (
    lowerQuery.includes('find') || 
    lowerQuery.includes('search') || 
    lowerQuery.includes('look for') || 
    lowerQuery.includes('when is') ||
    lowerQuery.includes('show me')
  ) {
    return 'search_event';
  }
  
  if (
    lowerQuery.includes('available') || 
    lowerQuery.includes('free') || 
    lowerQuery.includes('check time') || 
    lowerQuery.includes('when can') ||
    lowerQuery.includes('slot')
  ) {
    return 'check_availability';
  }
  
  if (
    lowerQuery.includes('help') || 
    lowerQuery.includes('how to') || 
    lowerQuery.includes('guide') || 
    lowerQuery.includes('assist')
  ) {
    return 'help';
  }
  
  if (
    lowerQuery.includes('what is') || 
    lowerQuery.includes('tell me about') || 
    lowerQuery.includes('explain')
  ) {
    return 'general_info';
  }
  
  return 'other';
};

// Process a chatbot query
exports.processQuery = async (req, res) => {
  try {
    const { query, userType = 'guest', userId } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }
    
    // Determine the intent
    const intent = determineIntent(query);
    
    // Initialize response and parameters
    let response = '';
    let parameters = {};
    let successful = true;
    
    // Process based on intent
    switch (intent) {
      case 'add_event': {
        // Extract parameters for adding an event
        const date = extractDateFromText(query);
        const time = extractTimeFromText(query);
        const duration = extractDurationFromText(query);
        const groupId = extractGroupIdFromText(query);
        const examinerName = extractExaminerFromText(query);
        const location = extractLocationFromText(query) || 'Main Hall';
        const subjectName = extractSubjectFromText(query) || 'General Presentation';
        
        parameters = {
          date,
          time,
          duration,
          groupId,
          examinerName,
          location,
          subjectName
        };
        
        // Check if we have enough information to create an event
        if (!date || !time || !groupId || !examinerName) {
          response = "I need more information to schedule a presentation. Please provide:";
          if (!date) response += " the date,";
          if (!time) response += " the time,";
          if (!groupId) response += " the group ID,";
          if (!examinerName) response += " the examiner name,";
          response = response.slice(0, -1) + ".";
          successful = false;
        } else {
          try {
            // Check if the time slot is available
            const startTime = new Date(`${date}T${time}`);
            const endTime = new Date(startTime.getTime() + duration * 60000);
            
            // Check for conflicts - simplified query to avoid MongoDB syntax issues
            const conflictingPresentations = await Presentation.find({
              date,
              time: { $lte: format(endTime, 'HH:mm') }
            });
            
            // Filter conflicts manually
            const actualConflicts = conflictingPresentations.filter(presentation => {
              const presStart = new Date(`${presentation.date}T${presentation.time}`);
              const presEnd = new Date(presStart.getTime() + presentation.duration * 60000);
              
              // Check if there's an overlap
              return (presStart < endTime && startTime < presEnd);
            });
            
            if (actualConflicts.length > 0) {
              response = `I found a scheduling conflict. There's already a presentation at that time. Please choose a different time.`;
              successful = false;
            } else {
              // Create the presentation
              const newPresentation = new Presentation({
                groupId,
                examinerName,
                examinerEmail: `${examinerName.toLowerCase().replace(/\s+/g, '.')}@schedex.edu`,
                date,
                time,
                duration,
                location,
                subjectName,
                status: 'Scheduled'
              });
              
              await newPresentation.save();
              
              response = `Great! I've scheduled a presentation for Group ${groupId} with ${examinerName} on ${format(startTime, 'MMMM d, yyyy')} at ${format(startTime, 'h:mm a')} in ${location}. The presentation will last for ${duration} minutes on the subject of ${subjectName}.`;
            }
          } catch (error) {
            console.error('Error creating presentation:', error);
            response = `I'm sorry, there was an error scheduling the presentation. Please try again.`;
            successful = false;
          }
        }
        break;
      }
      
      case 'search_event': {
        // Extract parameters for searching events
        const date = extractDateFromText(query);
        const groupId = extractGroupIdFromText(query);
        const examinerName = extractExaminerFromText(query);
        
        parameters = {
          date,
          groupId,
          examinerName
        };
        
        // Build search query
        const searchQuery = {};
        if (date) searchQuery.date = date;
        if (groupId) searchQuery.groupId = groupId;
        if (examinerName) searchQuery.examinerName = { $regex: examinerName, $options: 'i' };
        
        // If no parameters were extracted, return an error
        if (Object.keys(searchQuery).length === 0) {
          response = "I need more specific information to search for presentations. Please include a date, group ID, or examiner name.";
          successful = false;
        } else {
          try {
            // Search for presentations
            const presentations = await Presentation.find(searchQuery).limit(5);
            
            if (presentations.length === 0) {
              response = "I couldn't find any presentations matching your criteria.";
              successful = false;
            } else {
              response = `I found ${presentations.length} presentation${presentations.length > 1 ? 's' : ''}:\n\n`;
              
              presentations.forEach((presentation, index) => {
                const presentationDate = new Date(`${presentation.date}T${presentation.time}`);
                response += `${index + 1}. Group ${presentation.groupId} with ${presentation.examinerName} on ${format(presentationDate, 'MMMM d, yyyy')} at ${format(presentationDate, 'h:mm a')} in ${presentation.location}. Status: ${presentation.status}.\n`;
              });
              
              if (presentations.length === 5) {
                response += "\nI'm showing the first 5 results. If you need more specific results, please refine your search.";
              }
            }
          } catch (error) {
            console.error('Error searching presentations:', error);
            response = `I'm sorry, there was an error searching for presentations. Please try again.`;
            successful = false;
          }
        }
        break;
      }
      
      case 'check_availability': {
        // Extract parameters for checking availability
        const date = extractDateFromText(query);
        const examinerName = extractExaminerFromText(query);
        
        parameters = {
          date,
          examinerName
        };
        
        // Check if we have enough information
        if (!date) {
          response = "I need a specific date to check availability. Please include a date in your query.";
          successful = false;
        } else if (!examinerName) {
          try {
            // Check general availability for the date
            const presentations = await Presentation.find({ date }).sort({ time: 1 });
            
            if (presentations.length === 0) {
              response = `There are no presentations scheduled on ${format(parseISO(date), 'MMMM d, yyyy')}. The entire day is available!`;
            } else {
              response = `Here's the schedule for ${format(parseISO(date), 'MMMM d, yyyy')}:\n\n`;
              
              presentations.forEach((presentation, index) => {
                const startTime = new Date(`${presentation.date}T${presentation.time}`);
                const endTime = new Date(startTime.getTime() + presentation.duration * 60000);
                
                response += `${index + 1}. ${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}: Group ${presentation.groupId} with ${presentation.examinerName} in ${presentation.location}.\n`;
              });
              
              // Suggest available slots
              response += "\nAvailable time slots:\n";
              
              // Assume working hours from 9 AM to 5 PM
              const workStart = new Date(`${date}T09:00:00`);
              const workEnd = new Date(`${date}T17:00:00`);
              
              let currentTime = new Date(workStart);
              
              presentations.forEach(presentation => {
                const presentationStart = new Date(`${presentation.date}T${presentation.time}`);
                const presentationEnd = new Date(presentationStart.getTime() + presentation.duration * 60000);
                
                if (currentTime < presentationStart) {
                  response += `- ${format(currentTime, 'h:mm a')} to ${format(presentationStart, 'h:mm a')}\n`;
                }
                
                currentTime = new Date(presentationEnd);
              });
              
              if (currentTime < workEnd) {
                response += `- ${format(currentTime, 'h:mm a')} to ${format(workEnd, 'h:mm a')}\n`;
              }
            }
          } catch (error) {
            console.error('Error checking availability:', error);
            response = `I'm sorry, there was an error checking availability. Please try again.`;
            successful = false;
          }
        } else {
          try {
            // Check examiner's availability
            const examinerPresentations = await Presentation.find({ 
              date,
              examinerName: { $regex: examinerName, $options: 'i' }
            }).sort({ time: 1 });
            
            if (examinerPresentations.length === 0) {
              response = `${examinerName} has no presentations scheduled on ${format(parseISO(date), 'MMMM d, yyyy')}. They are available all day!`;
            } else {
              response = `${examinerName}'s schedule for ${format(parseISO(date), 'MMMM d, yyyy')}:\n\n`;
              
              examinerPresentations.forEach((presentation, index) => {
                const startTime = new Date(`${presentation.date}T${presentation.time}`);
                const endTime = new Date(startTime.getTime() + presentation.duration * 60000);
                
                response += `${index + 1}. ${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}: Group ${presentation.groupId} in ${presentation.location}.\n`;
              });
              
              // Suggest available slots
              response += `\n${examinerName} is available during these times:\n`;
              
              // Assume working hours from 9 AM to 5 PM
              const workStart = new Date(`${date}T09:00:00`);
              const workEnd = new Date(`${date}T17:00:00`);
              
              let currentTime = new Date(workStart);
              
              examinerPresentations.forEach(presentation => {
                const presentationStart = new Date(`${presentation.date}T${presentation.time}`);
                const presentationEnd = new Date(presentationStart.getTime() + presentation.duration * 60000);
                
                if (currentTime < presentationStart) {
                  response += `- ${format(currentTime, 'h:mm a')} to ${format(presentationStart, 'h:mm a')}\n`;
                }
                
                currentTime = new Date(presentationEnd);
              });
              
              if (currentTime < workEnd) {
                response += `- ${format(currentTime, 'h:mm a')} to ${format(workEnd, 'h:mm a')}\n`;
              }
            }
          } catch (error) {
            console.error('Error checking examiner availability:', error);
            response = `I'm sorry, there was an error checking ${examinerName}'s availability. Please try again.`;
            successful = false;
          }
        }
        break;
      }
      
      case 'help':
        response = "I can help you with the following:\n\n" +
          "1. Schedule a presentation: 'Schedule a presentation for Group A with examiner Smith on May 10 at 2 PM'\n" +
          "2. Search for presentations: 'Find presentations on May 15' or 'Show me Group B's presentations'\n" +
          "3. Check availability: 'Is examiner Johnson available on May 20?' or 'What time slots are available tomorrow?'\n\n" +
          "What would you like help with?";
        parameters = { helpType: 'general' };
        break;
      
      case 'general_info':
        response = "SchedEx is a presentation scheduling system that helps manage student presentations and examiner availability. " +
          "You can use it to schedule presentations, check availability, and manage your calendar. " +
          "Is there something specific about SchedEx you'd like to know?";
        parameters = { infoType: 'general' };
        break;
      
      default:
        response = "I'm not sure how to help with that. I can assist with scheduling presentations, searching for events, or checking availability. " +
          "Could you rephrase your question?";
        parameters = {};
        successful = false;
    }
    
    // Save the query and response to the database
    const chatbotQuery = new ChatbotQuery({
      userId,
      userType,
      query,
      intent,
      parameters,
      response,
      successful
    });
    
    await chatbotQuery.save();
    
    // Generate suggestions based on the intent and success
    let suggestions = [];
    
    if (!successful) {
      if (intent === 'add_event') {
        suggestions = [
          "Schedule presentation tomorrow at 2 PM",
          "Create event for Group A with Dr. Smith",
          "Help me schedule a presentation"
        ];
      } else if (intent === 'search_event') {
        suggestions = [
          "Find presentations next week",
          "Show Group B presentations",
          "Search for Dr. Johnson's schedule"
        ];
      } else if (intent === 'check_availability') {
        suggestions = [
          "Is tomorrow available?",
          "Check Dr. Smith's availability on Friday",
          "What time slots are free next Monday?"
        ];
      } else {
        suggestions = [
          "Schedule a presentation",
          "Check availability",
          "Search for presentations",
          "Help me use SchedEx"
        ];
      }
    } else {
      if (intent === 'add_event') {
        suggestions = [
          "Check my scheduled presentations",
          "Is this time slot available?",
          "Schedule another presentation"
        ];
      } else if (intent === 'search_event') {
        suggestions = [
          "Schedule one of these presentations",
          "Check availability for this date",
          "Find presentations next week"
        ];
      } else if (intent === 'check_availability') {
        suggestions = [
          "Schedule a presentation in this slot",
          "Check another date",
          "Show all my presentations"
        ];
      } else {
        suggestions = [
          "Schedule a presentation",
          "Check availability",
          "Search for presentations",
          "Thank you"
        ];
      }
    }
    
    return res.status(200).json({
      success: true,
      data: {
        response,
        intent,
        parameters,
        successful,
        suggestions
      }
    });
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing query',
      error: error.message
    });
  }
};

// Get recent chatbot queries for a user
exports.getRecentQueries = async (req, res) => {
  try {
    const { userId, limit = 10 } = req.params;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    const queries = await ChatbotQuery.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit, 10));
    
    return res.status(200).json({
      success: true,
      count: queries.length,
      data: queries
    });
  } catch (error) {
    console.error('Error getting recent queries:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting recent queries',
      error: error.message
    });
  }
};
