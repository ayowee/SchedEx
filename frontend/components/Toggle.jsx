import React, { useState } from 'react';

const Toggle = ({ isOn, onToggle, label }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          isOn ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </div>
  );
};

export default Toggle; 