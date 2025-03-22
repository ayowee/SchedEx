import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const InviteCalendar = () => {
  const [email, setEmail] = useState('');

  const handleInvite = () => {
    alert(`Invitation sent to ${email}`);
    setEmail('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Invite to Calendar</h3>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <Button variant="contained" color="error" onClick={handleInvite} fullWidth>
        Invite
      </Button>
    </div>
  );
};

export default InviteCalendar;