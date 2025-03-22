import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Scheduler from './components/Scheduler/Scheduler';
import ChatHead from './components/ChatHead/ChatHead';
import QuickMeeting from './components/QuickMeeting/QuickMeeting';
import ShareAvailability from './components/ShareAvailability/ShareAvailability';
import InviteCalendar from './components/InviteCalendar/InviteCalendar';
import ShortcutsModal from './components/ShortcutsModal/ShortcutsModal';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Navbar profileImage="profile.jpg" profileName="John Doe" />
      <div className="main-content">
        <div className="scheduler-container">
          <Scheduler />
        </div>
        <div className="features-container">
          <QuickMeeting />
          <ShareAvailability />
          <InviteCalendar />
          <ShortcutsModal />
        </div>
      </div>
      <ChatHead />
    </div>
  );
};

export default App;