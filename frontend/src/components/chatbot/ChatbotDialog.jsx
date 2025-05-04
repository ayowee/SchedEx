import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowLeftIcon, CalendarIcon, MagnifyingGlassIcon, ClockIcon } from '@heroicons/react/24/solid';
import chatbotService from '../../services/chatbotService';
import schedulaService from '../../services/schedulaService';
import schedula from '../../assets/schedula-logo.svg';

const ChatbotDialog = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'What brought you to SchedEx today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([
    "Schedule a presentation",
    "Find my presentations",
    "Check available time slots",
    "Help me use SchedEx"
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [botTyping, setBotTyping] = useState(false);
  const [userId] = useState('guest-' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle user message submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!input.trim() && !e?.currentTarget?.dataset?.suggestion) return;
    
    const userMessage = e?.currentTarget?.dataset?.suggestion || input;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: userMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setShowSuggestions(false);
    
    // Simulate bot typing
    setBotTyping(true);
    
    try {
      // Get user type from URL - student or examiner
      const path = window.location.pathname;
      const userType = path.includes('/students') ? 'student' : path.includes('/examiner') ? 'examiner' : 'general';
      
      // Call the backend API for AI processing using schedulaService
      const response = await schedulaService.processQuery(userMessage, userType, userId);
      
      if (response.success) {
        const botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: response.data.response,
          timestamp: new Date(),
          intent: response.data.intent,
          parameters: response.data.parameters
        };
        
        setMessages(prev => [...prev, botResponse]);
        setSuggestions(response.data.suggestions || []);
      } else {
        // Fallback to local service if API fails
        const localResponse = chatbotService.getResponse(userMessage, userType);
        
        const fallbackResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: "I'm having trouble connecting to my brain. " + localResponse.text,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, fallbackResponse]);
        setSuggestions(localResponse.suggestions);
      }
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      
      // Check if it's a connection error
      const isConnectionError = error.message && (
        error.message.includes('Network Error') || 
        error.message.includes('ECONNREFUSED') ||
        error.code === 'ERR_NETWORK'
      );
      
      // Fallback to local service
      const localResponse = chatbotService.getResponse(userMessage, 'general');
      
      const errorResponse = {
        id: messages.length + 2,
        sender: 'bot',
        text: isConnectionError 
          ? "I'm currently offline. The backend server appears to be down. Please make sure the backend is running on port 5002. In the meantime, I can still help with basic information: " + localResponse.text
          : "I'm having trouble processing your request right now. " + localResponse.text,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
      setSuggestions(isConnectionError 
        ? ["Restart the backend server", "Check server status", "Help me with basic info"] 
        : localResponse.suggestions);
    } finally {
      setBotTyping(false);
      setShowSuggestions(true);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSubmit({ preventDefault: () => {}, currentTarget: { dataset: { suggestion } } });
  };

  // Render intent icon based on message intent
  const renderIntentIcon = (intent) => {
    switch (intent) {
      case 'add_event':
        return <CalendarIcon className="h-4 w-4 text-indigo-500" />;
      case 'search_event':
        return <MagnifyingGlassIcon className="h-4 w-4 text-indigo-500" />;
      case 'check_availability':
        return <ClockIcon className="h-4 w-4 text-indigo-500" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh] border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-700 text-white p-4 flex items-center">
        <button 
          onClick={onClose}
          className="mr-2 hover:bg-indigo-800 rounded-full p-1"
          aria-label="Close Schedula"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mr-2">
            <img 
              src={schedula} 
              alt="Schedula" 
              className="h-6 w-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
              }}
            />
          </div>
          <div>
            <h3 className="font-medium">Schedula</h3>
            <div className="flex items-center">
              <span className="h-2 w-2 bg-green-400 rounded-full mr-1"></span>
              <span className="text-xs text-green-200">AI Assistant</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
          >
            {message.sender === 'bot' && (
              <div className="flex items-start mb-1">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                  <img 
                    src={schedula} 
                    alt="Schedula" 
                    className="h-6 w-6"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
                    }}
                  />
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <span>Schedula</span>
                  {message.intent && (
                    <span className="ml-2 flex items-center">
                      {renderIntentIcon(message.intent)}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div 
              className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
              <div 
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {botTyping && (
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
              <img 
                src={schedula} 
                alt="Schedula" 
                className="h-6 w-6"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
                }}
              />
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-white">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-200 bg-white">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Schedula something..."
            className="flex-1 bg-transparent outline-none text-sm py-1"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`ml-2 p-1 rounded-full ${
              input.trim() ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-400'
            }`}
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotDialog;
