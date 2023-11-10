import React, { useEffect } from 'react';
import './About.css';
import { Container, Typography, Grid, Paper } from '@mui/material';


const About = () => {

  return (
    <Container className="about-container">
      <Typography variant="h3" className="about-heading" gutterBottom>
        ABOUT
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={5} className="about-images">
            <img className="about-img" src="../img/f.jpg" alt="Formula 1 Team" />
          </Paper>
            <div className="languages-used">
              <Typography variant="h6" className="about-stat-label">
                Languages Used
              </Typography>
              <div className="about-team-stats">
                <div className="about-stat-item">C#</div>
                <div className="about-stat-item">JavaScript</div>
              </div>
            </div>  
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="about-text">
            <div className="about-section">
              <Typography variant="h4" className="about-section-heading" gutterBottom>
                The Website
              </Typography>
              <Typography variant="body1" className="about-description">
                Welcome to our Formula 1 Team website, your one-stop destination for all things F1. Immerse yourself in the world of Formula 1, explore detailed team information, cheer for your favorite drivers, and book tickets for the most thrilling races around the globe.
              </Typography>
            </div>
            <div className="about-section">
              <Typography variant="h4" className="about-section-heading" gutterBottom>
                What Makes Us Different?
              </Typography>
              <Typography variant="body1" className="about-additional-info">
                Why did we create this platform? Because we believe in filling the gap – the lack of a comprehensive website offering both team details and ticket booking services. Here, users can interact in a friendly environment, share their thoughts, vote for their favorite drivers, and become an integral part of the F1 excitement.
              </Typography>
            </div>
            <div className="about-section">
              <Typography variant="h4" className="about-section-heading" gutterBottom>
                The Team
              </Typography>
              <Typography variant="body1" className="about-designed-by">
                Designed by Nithin Jose, RMCA-B.
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
