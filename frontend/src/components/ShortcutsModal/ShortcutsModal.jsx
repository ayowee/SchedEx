import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const ShortcutsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button variant="contained" color="warning" onClick={() => setIsOpen(true)} fullWidth>
        Useful Shortcuts
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogContent>
          <ul className="list-disc pl-5">
            <li>Command Menu: <kbd>Ctrl</kbd> + <kbd>K</kbd></li>
            <li>Go to Date: <kbd>Ctrl</kbd> + <kbd>G</kbd></li>
            <li>Nation Calendar Menu: <kbd>Ctrl</kbd> + <kbd>N</kbd></li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShortcutsModal;