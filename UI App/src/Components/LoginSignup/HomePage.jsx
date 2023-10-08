import React, { useEffect } from 'react';
import { HomeCarousel } from './HomeCarousel';
import HomeNavbar from './HomeNavbar';
import { About } from './About';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const tokenPayload = jwt_decode(token);
        const roleId = tokenPayload.RoleId;

        if (roleId === 'Admin') {
          navigate('/AdminHome');
        } else {
          navigate('/UserHome');
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
      <HomeCarousel />
      <About />
      <Footer />
    </div>
  );
};
