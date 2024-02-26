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
          <li><a href="/" className="nav-linkss">Home</a></li>
          <li><a href="/DriverListGuest" className="nav-linkss">Drivers</a></li>
          <li><a href="/F1HistoryGuestView" className="nav-linkss">F1 History</a></li>
          <li><a href="/TeamHistoryGuestView" className="nav-linkss">Team History</a></li>
          <li><a href="/GalleryGuestView" className="nav-linkss">Gallery</a></li>
          <li><a href="/Signin" className="nav-linkss">Login</a></li>
          <li><a href="/Signup" className="nav-link2">Register Account</a></li>
        </ul>
        <button onClick={handleToggleMobileMenu} className="navbar-toggle">
          {isMobileMenuOpen ? 'Close Menu' : 'Menu'}
        </button>
      </div>
    </nav>
  );
}

export default HomeNavbar;
