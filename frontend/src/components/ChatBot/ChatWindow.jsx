import React from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';

const ChatWindow = ({
  isMinimized,
  setIsMinimized,
  setIsOpen,
  messages,
  isTyping,
  inputValue,
  setInputValue,
  handleSend,
  handleOptionClick,
  messagesEndRef
}) => (
  <Paper
    elevation={3}
    sx={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      width: 360,
      maxHeight: isMinimized ? 72 : 600,
      borderRadius: 2,
      overflow: 'hidden',
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}
  >
    <ChatHeader 
      isMinimized={isMinimized}
      setIsMinimized={setIsMinimized}
      setIsOpen={setIsOpen}
    />

    {!isMinimized && (
      <>
        <Box
          sx={{
            height: 400,
            overflowY: 'auto',
            p: 2,
            bgcolor: '#f5f5f5'
          }}
        >
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              handleOptionClick={handleOptionClick}
            />
          ))}
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="caption">Schedula is typing...</Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
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
      </>
    )}
  </Paper>
);

export default ChatWindow; 