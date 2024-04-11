import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import Footer from './Footer';
import jwt_decode from 'jwt-decode';
import { HomeCarousel } from './HomeCarousel';
import About from './About'; // assuming that About.jsx is in the same directory
import { Container, Typography, CssBaseline, Box } from '@mui/material';
import './AuthenticatedUserHome.css';

const AuthenticatedUserHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [detectedFaceName, setDetectedFaceName] = useState('');

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

        // Fetch the detected face name
        fetch('http://127.0.0.1:8100/get_detected_face_name/')
          .then(response => response.json())
          .then(data => {
            setDetectedFaceName(data.detected_face_name);
          })
          .catch(error => {
            console.error('Error fetching detected face name:', error);
          });
      }
    }
  }, [navigate]);

  return (
    <div className="Containers" style={{ backgroundColor: "gray" }}>
      <CssBaseline />
      <UserNavbar />
      <div className="greetingClass" style={{ maxWidth: "100%", marginTop: "70px" }}>
        <Box mt={2}>
        </Box>
      </div>
      {/* 
      <br />
      <br />
      <h1>Detected Face Name : {detectedFaceName}</h1> 
      <br />
      <br />
      */}
      <HomeCarousel className="HomeCarousel" />
      <About className="About" />
      <Footer className="Footer" />
    </div>
  );
};

export default AuthenticatedUserHome;
