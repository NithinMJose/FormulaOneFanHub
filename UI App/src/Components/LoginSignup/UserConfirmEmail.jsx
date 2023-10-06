import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserConfirmEmail.css';
import user_icon from '../Assets/abc.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';

const UserConfirmEmail = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userOtp, setUserOtp] = useState('');

  useEffect(() => {
    // Check if there is a valid token in localStorage
    const token = localStorage.getItem('jwtToken');

    if (token) {
      // Parse the token to get the RoleId
      const tokenPayload = jwt_decode(token);
      const roleId = tokenPayload['RoleId'];

      // Redirect based on the RoleId
      if (roleId === 'Admin') {
        navigate('/AdminHome');
      } else if (roleId === 'User') {
        navigate('/UserHome');
      } else {
        navigate('/Home');
      }
    }
  }, [navigate]);

  const handleEmailConfirm = async () => {
    try {
      const response = await axios.post(
        `https://localhost:7092/api/User/ConfirmEmail?userName=${username}&OtpToken=${userOtp}`
      );

      if (response.data.success) {
        // Handle successful confirmation
        toast.success('Email confirmed successfully! Login to your Account.');
        // Redirect or do any additional actions upon successful confirmation
        navigate('/Signin');
      } else {
        // Handle unsuccessful confirmation
        toast.error('Email confirmation failed. Please check your OTP and try again.');
      }
    } catch (error) {
      // Handle error
      console.error(error);
      toast.error('An error occurred during email confirmation');
    }
  };

  // Adding some margin to push the footer down
  const containerStyle = {
    marginBottom: '20px', // Adjust this value as needed
  };

  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      <br />

      <div className="container2" style={containerStyle}>
        <div className="header">
          <div className="text">Confirm Email</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Enter Username..."
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Enter OTP Here..."
              onChange={(e) => setUserOtp(e.target.value)}
            />
          </div>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleEmailConfirm}>
            Confirm Email
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default UserConfirmEmail;