import React from 'react';
import './Navbar.css';

const Navbar = ({ profileImage, profileName }) => {
  return (
    <div className="navbar">
      <div className="logo">Nation Calendar</div>
      <div className="profile">
        <img src={profileImage} alt="Profile" className="profile-image" />
        <span className="profile-name">{profileName}</span>
      </div>
    </div>
  );
};

export default Navbar;