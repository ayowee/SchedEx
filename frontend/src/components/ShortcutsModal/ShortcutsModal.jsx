import React, { useState } from 'react';
import './ShortcutsModal.css';

const ShortcutsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="shortcuts-modal">
      <button onClick={() => setIsOpen(!isOpen)}>Useful Shortcuts</button>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Keyboard Shortcuts</h3>
            <ul>
              <li>Command Menu: <kbd>Ctrl</kbd> + <kbd>K</kbd></li>
              <li>Go to Date: <kbd>Ctrl</kbd> + <kbd>G</kbd></li>
              <li>Nation Calendar Menu: <kbd>Ctrl</kbd> + <kbd>N</kbd></li>
            </ul>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortcutsModal;