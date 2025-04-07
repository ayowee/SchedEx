import React from 'react';
import { Box } from '@mui/material';
import { GeminiLogo } from './GeminiLogo';

const ChatButton = ({ isOpen, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #9168C0 0%, #5684D1 50%, #1BA1E3 100%)',
      cursor: 'pointer',
      display: !isOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      },
      zIndex: 1000,
    }}
  >
    <GeminiLogo />
  </Box>
);

export default ChatButton; 