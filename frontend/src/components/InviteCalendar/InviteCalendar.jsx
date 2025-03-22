import React, { useState } from 'react';
import './InviteCalendar.css';

const InviteCalendar = () => {
  const [email, setEmail] = useState('');

  const handleInvite = () => {
    alert(`Invitation sent to ${email}`);
    setEmail('');
  };

  return (
    <div className="invite-calendar">
      <h3>Invite to Calendar</h3>
      <input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleInvite}>Invite</button>
    </div>
  );
};

export default InviteCalendar;