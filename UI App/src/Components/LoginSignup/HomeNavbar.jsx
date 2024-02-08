import React, { useState } from 'react';
import './HomeNavbar.css'; // Make sure to import the updated CSS file

function HomeNavbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src="./img/logo.png" alt="Logo" className="logo" />
          <h1 className="brand-name">Formula  1 Fan Hub</h1>
        </div>
        <ul className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><a href="/" className="nav-link">Home</a></li>
          <li><a href="/DriverListGuest" className="nav-link">Drivers</a></li>
          <li><a href="/F1HistoryGuestView" className="nav-link">F1 History</a></li>
          <li><a href="/TeamHistoryGuestView" className="nav-link">Team History</a></li>
          <li><a href="/GalleryGuestView" className="nav-link">Gallery</a></li>
          <li><a href="/Signin" className="nav-link">Login</a></li>
        </ul>
        <button onClick={handleToggleMobileMenu} className="navbar-toggle">
          {isMobileMenuOpen ? 'Close Menu' : 'Menu'}
        </button>
      </div>
    </nav>
  );
}

export default HomeNavbar;
