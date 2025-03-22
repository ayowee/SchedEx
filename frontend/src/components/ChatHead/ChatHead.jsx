import React, { useState } from 'react';
import { IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const ChatHead = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <IconButton onClick={() => setIsOpen(true)} color="primary" aria-label="chat">
        <ChatIcon fontSize="large" />
      </IconButton>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle className="flex justify-between items-center">
          <span>AI Assistant</span>
          <IconButton onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                <p>{msg}</p>
              </div>
            ))}
          </div>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendMessage} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatHead;