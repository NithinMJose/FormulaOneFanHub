import React, { useEffect } from 'react';
import { HomeCarousel } from './HomeCarousel';
import HomeNavbar from './HomeNavbar';
import { About } from './About';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate('/UserHome');
    }
  }, [navigate]);

  return (
    <div>
      <HomeNavbar />
      <HomeCarousel />
      <About />
      <Footer />
    </div>
  );
};
