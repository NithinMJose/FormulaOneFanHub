import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';
import user_icon from '../Assets/abc.png';
import password_icon from '../Assets/ghi.png';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const ForgotPass = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const navigate = useNavigate(); // Add this line

  const handleSendVerification = async () => {
    try {
      await axios.post('https://localhost:7092/api/User/SendOtp', { userName: username });
      setIsUsernameSubmitted(true);
    } catch (error) {
      handleError(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post('https://localhost:7092/api/User/VerifyOtp', { userName: username, otp: otp });
      setIsOtpVerified(true);
      console.log('OTP verified');
    } catch (error) {
      handleError(error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await axios.post('https://localhost:7092/api/User/UpdatePassword', {
        userName: username,
        newPassword: newPassword,
      });
      console.log('Password reset successfully');
      navigate('/Signin'); // Fix: Use the navigate function
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      console.error('Server responded with a status code that falls out of the range of 2xx:', error.response.data);
    } else if (error.request) {
      console.error('The request was made but no response was received:', error.request);
    } else {
      console.error('Something happened in setting up the request that triggered an Error:', error.message);
    }
  };

  const containerStyle = {
    marginBottom: '20px',
  };

  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      <br />

      <div className="container2" style={containerStyle}>
        <div className="header">
          <div className="text">
            {isOtpVerified ? 'Reset Password' : 'Forgot Password'}
          </div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {isUsernameSubmitted && (
            <div className="input">
              <img src={password_icon} alt="" />
              <input
                type="text"
                placeholder="OTP Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          {isOtpVerified && (
            <>
              <div className="input">
                <img src={password_icon} alt="" />
                <input
                  type="password"
                  placeholder="Enter new Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="input">
                <img src={password_icon} alt="" />
                <input
                  type="password"
                  placeholder="Confirm new Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        <div className="forgot-password">
          <button
            onClick={
              isOtpVerified ? handlePasswordReset : isUsernameSubmitted ? handleVerifyOtp : handleSendVerification
            }
            className="submit"
          >
            {isOtpVerified ? 'Reset Password' : isUsernameSubmitted ? 'Verify Email' : 'Add Verification'}
          </button>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default ForgotPass;
