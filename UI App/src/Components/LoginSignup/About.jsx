// About.jsx
import React, { useEffect } from 'react';
import './About.css';

export const About = () => {
  useEffect(() => {
    // Additional setup here
  }, []);

  return (
    <div className="about-container">
      <h2 className="about-heading">ABOUT</h2>
      <div className="about-content">
        <div className="about-images">
          <img
            className="about-img"
            src="../img/f.jpg"
            alt="Formula 1 Team"
          />
          <div className="languages-used">
            <span className="about-stat-label">Languages</span>
            <div className="about-team-stats">
              <div className="about-stat-item">
                C#
                Javascript
              </div>
            </div>
          </div>
        </div>
        <div className="about-text">
          <div className="about-section">
            <h3 className="about-section-heading">The Website</h3>
            <p className="about-description">
              Welcome to our Formula 1 Team website, your one-stop destination for all things F1. Immerse yourself in the world of Formula 1, explore detailed team information, cheer for your favorite drivers, and book tickets for the most thrilling races around the globe.
            </p>
          </div>
          <div className="about-section">
            <h3 className="about-section-heading">What Makes Us Different?</h3>
            <p className="about-additional-info">
              Why did we create this platform? Because we believe in filling the gap – the lack of a comprehensive website offering both team details and ticket booking services. Here, users can interact in a friendly environment, share their thoughts, vote for their favorite drivers, and become an integral part of the F1 excitement.
            </p>
          </div>
          <div className="about-section">
            <h3 className="about-section-heading">The Team</h3>
            <p className="about-designed-by">
              Designed by Nithin Jose, RMCA-B.
            </p>
          </div>
        </div>
      </div>
      <br /> 
      <br />
    </div>
  );
};
