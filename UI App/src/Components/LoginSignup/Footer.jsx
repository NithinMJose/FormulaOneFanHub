import React from 'react';
import './Footer.css'; // Import the CSS file for styling

function Footer() {
  return (
    <div className="footer">
      <div className="footer-left">
        <h1>Formula One Grand Prix</h1>
        <p className="place">Location: Monaco</p>
        <p className="date">Date: July 25, 2023</p>
      </div>
      <div className="footer-center">
        <blockquote className="quotation">
          "Formula One is the pinnacle of motorsport."
        </blockquote>
        <p className="caption">The world's most prestigious motorsport event.</p>
      </div>
      <div className="footer-right">
        <nav className="links">
          <a href="/contact">Contact Us</a>
          <a href="/about">About</a>
        </nav>
        <div className="copyright">
          &copy; 2023 Formula One Grand Prix. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Footer;
