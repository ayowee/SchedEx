import React, { useState } from 'react';
import './ChatHead.css';

const ChatHead = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chat-head">
      <button onClick={() => setIsOpen(!isOpen)}>
        <img src="ai-chat-icon.png" alt="AI Chat" />
      </button>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">AI Assistant</div>
          <div className="chat-body">
            <p>Hello! How can I assist you today?</p>
          </div>
          <input type="text" placeholder="Type your message..." />
        </div>
      )}
    </div>
  );
};

export default ChatHead;