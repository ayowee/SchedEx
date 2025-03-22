import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Share Availability</h3>
      <Button variant="contained" color="success" onClick={generateLink} fullWidth className="mb-4">
        Generate Link
      </Button>
      {link && (
        <div className="flex gap-2">
          <TextField
            fullWidth
            variant="outlined"
            value={link}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button variant="contained" color="primary" onClick={copyLink}>
            Copy
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShareAvailability;