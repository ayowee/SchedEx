import React from 'react';
import Navbar from './components/Navbar/Navbar';
import CustomScheduler from './components/Scheduler/Scheduler';
import ChatHead from './components/ChatHead/ChatHead';
import QuickMeeting from './components/QuickMeeting/QuickMeeting';
import ShareAvailability from './components/ShareAvailability/ShareAvailability';
import InviteCalendar from './components/InviteCalendar/InviteCalendar';
import ShortcutsModal from './components/ShortcutsModal/ShortcutsModal';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar profileImage="profile.jpg" profileName="John Doe" />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scheduler on the left */}
          <div className="lg:col-span-2">
            <CustomScheduler />
          </div>

          {/* Features on the right */}
          <div className="space-y-6">
            <QuickMeeting />
            <ShareAvailability />
            <InviteCalendar />
            <ShortcutsModal />
          </div>
        </div>
      </div>
      <ChatHead />
    </div>
  );
};

export default App;