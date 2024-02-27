import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import Footer from './Footer';
import jwt_decode from 'jwt-decode';
import { HomeCarousel } from './HomeCarousel';
import About from './About'; // assuming that About.jsx is in the same directory
import { Container, Typography, CssBaseline, Box } from '@mui/material';

const AuthenticatedUserHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if the JWT token is present in local storage
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    console.log('Decoded Token:', decodedToken);

    if (!token) {
      // If the token is not present, show a toast and redirect to the login page
      toast.error('Login and then access the Home page');
      navigate('/Signin');
    } else {
      const tokenPayload = jwt_decode(token);

      if (tokenPayload.RoleId === 'Admin') {
        navigate('/AdminHome');
      } else if (tokenPayload.RoleId === 'User') {
        setUserName(tokenPayload.userName);
        // Rest of your code here
      }
    }
  }, [navigate]);

  return (
    <Box>
      <CssBaseline />
      <UserNavbar />
      <br />
      <br />
      <br />
      <br />
      <Container maxWidth="xl">
        <Box mt={2}>
          <Typography variant="h4" align="center" gutterBottom>
            Hello {userName}
          </Typography>
          <Typography variant="h2" align="center" gutterBottom>
            Welcome Back to the Fan Hub
          </Typography>
        </Box>
      </Container>
      <HomeCarousel />
      <About />
      <Footer />
    </Box>
  );
};

export default AuthenticatedUserHome;
