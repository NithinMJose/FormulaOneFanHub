import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { HomeCarousel } from './HomeCarousel';
import HomeNavbar from './HomeNavbar';
import About from './About';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export const HomePage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if About component is in view
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const yOffset = window.innerHeight * 0.5;
      const aboutSectionTop = aboutSection.getBoundingClientRect().top;
      
      if (aboutSectionTop < (yOffset+600)) {
        controls.start('visible');
      } else {
        controls.start('hidden');
      }
    }
  }, [scrollY, controls]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const tokenPayload = jwt_decode(token);
        const roleId = tokenPayload.RoleId;

        if (roleId === 'Admin') {
          navigate('/AdminHome');
        }
        else if(roleId === 'Team'){
          navigate('/TeamHome');
        }
        else if(roleId === 'User'){
          navigate('/UserHome');
        }
        else {
          navigate('/DeliveryCompanyHome');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Handle decoding error, maybe redirect to a login page
      }
    }
  }, [navigate]);

  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      <br />
      <HomeCarousel />
      <motion.div
  id="about"
  initial="hidden"
  animate={controls}
  variants={{
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }}
  style={{ marginTop: '-1.5cm' }} // Apply negative margin-top to position it higher
>
  <About />
</motion.div>

      <Footer />
    </div>
  );
};

export default HomePage;
