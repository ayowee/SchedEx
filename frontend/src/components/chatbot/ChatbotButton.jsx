import { useState } from 'react';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ChatbotDialog from './ChatbotDialog';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-indigo-700 hover:bg-indigo-800 text-white rounded-full p-3 shadow-lg transition-all duration-300 z-50 flex items-center justify-center"
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <QuestionMarkCircleIcon className="h-6 w-6" />
        )}
      </button>
      
      <ChatbotDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatbotButton;
