import React, { useState } from 'react';
import './QuickMeeting.css';

const QuickMeeting = () => {
  const [meetingWith, setMeetingWith] = useState('');

  const handleSchedule = () => {
    alert(`Meeting scheduled with ${meetingWith}`);
    setMeetingWith('');
  };

  return (
    <div className="quick-meeting">
      <h3>Quick Meeting</h3>
      <input
        type="text"
        placeholder="Meet with..."
        value={meetingWith}
        onChange={(e) => setMeetingWith(e.target.value)}
      />
      <button onClick={handleSchedule}>Schedule</button>
    </div>
  );
};

export default QuickMeeting;