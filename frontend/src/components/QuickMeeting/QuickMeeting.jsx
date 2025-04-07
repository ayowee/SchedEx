import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const QuickMeeting = () => {
  const [meetingWith, setMeetingWith] = useState('');

  const handleSchedule = () => {
    alert(`Meeting scheduled with ${meetingWith}`);
    setMeetingWith('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Quick Meeting</h3>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Meet with..."
        value={meetingWith}
        onChange={(e) => setMeetingWith(e.target.value)}
        className="mb-4"
      />
      <Button variant="contained" color="primary" onClick={handleSchedule} fullWidth>
        Schedule
      </Button>
    </div>
  );
};

export default QuickMeeting;