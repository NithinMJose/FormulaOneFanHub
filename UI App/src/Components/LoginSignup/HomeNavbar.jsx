import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCut } from '@fortawesome/free-solid-svg-icons';
import './HomeNavbar.css'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';


function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FontAwesomeIcon icon={faCut} />
        <h1>Formula1 FanHub</h1>
      </div>
      <button className={`navbar-toggle ${isOpen ? 'open' : ''}`} onClick={toggleNavbar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <h2 className="HomeNavHome"><a href="/">Home</a></h2>
        <h2 className='HomeNavAbout full-height-background'><a href="/about">About</a></h2>
        <h2 className='HomeNavServices full-height-background'><a href="/service">Service</a></h2>
        <h2 className='HomeNavPages full-height-background'><a href="/pages">Pages</a></h2>
        <h2 className='HomeNavUsers full-height-background'><a href="/users">Users</a></h2>
        <h2 className="HomeNavRegisterNew"><a href="">RegisterNew</a></h2>
      </div>
    </nav>
  );
}

export default HomeNavbar;
