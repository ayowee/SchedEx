import React, { useState } from 'react';
import './ShareAvailability.css';

const ShareAvailability = () => {
  const [link, setLink] = useState('');

  const generateLink = () => {
    const newLink = 'https://nationcalendar.com/availability/12345';
    setLink(newLink);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="share-availability">
      <h3>Share Availability</h3>
      <button onClick={generateLink}>Generate Link</button>
      {link && (
        <div className="link-container">
          <input type="text" value={link} readOnly />
          <button onClick={copyLink}>Copy</button>
        </div>
      )}
    </div>
  );
};

export default ShareAvailability;