import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserConfirmEmail.css';
import user_icon from '../Assets/abc.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import { BASE_URL } from '../../config';

const UserConfirmEmail = (props) => {
  const navigate = useNavigate();
  const [confirmData, setConfirmData] = useState({
    userName: '',
    otpToken: '',
  });

  // Extracting values from props.location.state
  const { username, email, otp } = props.location?.state || {};

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
      if (!confirmData.userName || !confirmData.otpToken) {
        toast.error('Username and OTP are required.');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/User/TestEndPoint`, // Updated endpoint URL
        {
          userName: confirmData.userName,
          otpToken: confirmData.otpToken,
        }
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

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request data:', error.request);
        toast.error('No response from the server. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  // Adding some margin to push the footer down
  const containerStyle = {
    marginBottom: '20px', // Adjust this value as needed
  };

  // Update state when input values change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfirmData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      <br />

      <div className="container2">
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
              name="userName"
              onChange={handleInputChange}
            />
          </div>
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Enter OTP Here..."
              name="otpToken"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleEmailConfirm}>
            Confirm Email
          </div>
        </div>

        {/* Display passed values */}
        <h2>Passed Values:</h2>
        <p>Username: {username}</p>
        <p>Email: {email}</p>
        <p>OTP: {otp}</p>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default UserConfirmEmail;
