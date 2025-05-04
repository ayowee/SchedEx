// src/layouts/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ChatbotButton from '../components/chatbot/ChatbotButton';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Function to handle sidebar collapse state
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
    // Update header margin when sidebar collapses
    const header = document.querySelector('header');
    if (header) {
      header.style.marginLeft = collapsed ? '4rem' : '16rem';
    }
  };

  // Update header margin on component mount
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      header.style.marginLeft = sidebarCollapsed ? '4rem' : '16rem';
    }
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        <main className="flex-1 p-6 mt-16 overflow-auto">
          {children}
        </main>
        <Footer />
      </div>
      <ChatbotButton />
    </div>
  );
};

export default AdminLayout;
