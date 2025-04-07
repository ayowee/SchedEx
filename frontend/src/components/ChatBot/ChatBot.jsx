import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Fab,
  TextField,
  Avatar,
  Button,
  Collapse,
  Fade,
  CircularProgress
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachIcon,
} from "@mui/icons-material";

// Updated Gemini Logo with white gradient
const GeminiLogo = () => (
  <svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    style={{ width: "24px", height: "24px" }}
  >
    <path
      d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"
      fill="url(#prefix__paint0_radial_980_20147)"
    />
    <defs>
      <radialGradient
        id="prefix__paint0_radial_980_20147"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"
      >
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#F0F0F0" stopOpacity="1" />
      </radialGradient>
    </defs>
  </svg>
);

// Initial messages for the chatbot
const initialMessages = [
  {
    type: 'bot',
    text: "Hi! I'm Schedula AI, your scheduling assistant. How can I help you today?",
    timestamp: new Date(),
  },
  {
    type: 'bot',
    text: "I can help you with:",
    options: [
      "Schedule a meeting",
      "Find available time slots",
      "Reschedule an event",
      "Check my calendar"
    ],
    timestamp: new Date(),
  }
];

// Simulated bot responses based on user input
const getBotResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('schedule') && lowerMessage.includes('meeting')) {
    return {
      text: "I'll help you schedule a meeting. When would you like to schedule it for?",
      options: ["Today", "Tomorrow", "This week", "Next week"]
    };
  }
  if (lowerMessage.includes('available') || lowerMessage.includes('time slot')) {
    return {
      text: "I'll check your calendar for available time slots. Which day should I look at?",
      options: ["Today", "Tomorrow", "This week"]
    };
  }
  if (lowerMessage.includes('reschedule')) {
    return {
      text: "Sure, I can help you reschedule. Which event would you like to reschedule?",
      options: ["Team Meeting", "Project Review", "Client Call"]
    };
  }
  return {
    text: "I understand you're asking about: " + userMessage + ". Could you please provide more details?",
    options: ["Schedule meeting", "Find time", "Check calendar"]
  };
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage.text);
      setMessages(prev => [...prev, {
        type: 'bot',
        ...botResponse,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleOptionClick = (option) => {
    handleSend(option);
    setInputValue(option);
  };

  return (
    <>
      {/* Chat Button with Gradient */}
      <Box
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, #9168C0 0%, #5684D1 50%, #1BA1E3 100%)",
          cursor: "pointer",
          display: !isOpen ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
          zIndex: 1000,
        }}
      >
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          style={{
            width: "32px",
            height: "32px",
          }}
        >
          <path
            d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"
            fill="url(#prefix__paint0_radial_980_20147)"
          />
          <defs>
            <radialGradient
              id="prefix__paint0_radial_980_20147"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#F0F0F0" stopOpacity="1" />
            </radialGradient>
          </defs>
        </svg>
      </Box>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 360,
            maxHeight: isMinimized ? 72 : 600,
            borderRadius: 2,
            overflow: "hidden",
            zIndex: 1000,
            transition: "all 0.3s ease",
            display: isOpen ? "block" : "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background:
                "linear-gradient(135deg, #9168C0 0%, #5684D1 50%, #1BA1E3 100%)",
              p: 2,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  bgcolor: "transparent",
                  width: 40,
                  height: 40,
                  "& svg": {
                    width: "28px",
                    height: "28px",
                  },
                }}
              >
                <GeminiLogo />
              </Avatar>
              <Box>
                <Typography variant="subtitle1">Schedula AI</Typography>
                <Typography variant="caption">Scheduling Assistant</Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <KeyboardArrowDownIcon />
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Collapse in={!isMinimized}>
            {/* Messages */}
            <Box
              sx={{
                height: 400,
                overflowY: "auto",
                p: 2,
                bgcolor: "#f5f5f5",
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: message.type === "user" ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: "80%",
                      bgcolor:
                        message.type === "user" ? "primary.main" : "white",
                      color: message.type === "user" ? "white" : "text.primary",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                  </Paper>
                  {message.options && (
                    <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {message.options.map((option, i) => (
                        <Typography
                          key={i}
                          onClick={() => handleOptionClick(option)}
                          sx={{
                            px: 2,
                            py: 0.5,
                            bgcolor: "white",
                            borderRadius: 5,
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            border: "1px solid",
                            borderColor: "primary.main",
                            color: "primary.main",
                            "&:hover": {
                              bgcolor: "primary.main",
                              color: "white",
                            },
                          }}
                        >
                          {option}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
              {isTyping && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="caption">Schedula is typing...</Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                bgcolor: "white",
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="small">
                  <EmojiIcon />
                </IconButton>
                <IconButton size="small">
                  <AttachIcon />
                </IconButton>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Collapse>
        </Paper>
      </Fade>
    </>
  );
};

export default ChatBot;
