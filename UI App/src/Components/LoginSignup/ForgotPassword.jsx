import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Make sure to include the same CSS file as in the Signup component
import user_icon from '../Assets/abc.png';
import password_icon from '../Assets/ghi.png';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPass = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();

  const handleSendVerification = async () => {
    try {
      await axios.post('https://localhost:7092/api/User/SendOtp', { userName: username });
      setIsUsernameSubmitted(true);
      toast.success('Verification email is being sent. Check your inbox.');
    } catch (error) {
      handleError(error);
      toast.error('User not found. Please check your username.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{7}$/.test(otp)) {
      setOtpError('The OTP must be a 7-digit number');
      return;
    }

    try {
      await axios.post('https://localhost:7092/api/User/VerifyOtp', { userName: username, otp: otp });
      setIsOtpVerified(true);
      toast.success('Email verified. Please proceed with the new Password');
    } catch (error) {
      handleError(error);
      toast.error('OTP is not verified. Try again');
    }
  };

  const handlePasswordReset = async () => {
    // Validate new password
    const newPasswordValidationResult = validatePassword(newPassword);
    if (newPasswordValidationResult) {
      setNewPasswordError(newPasswordValidationResult);
      return;
    }

    // Validate confirm new password
    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      // Your API endpoint for password reset
      await axios.post('https://localhost:7092/api/User/UpdatePassword', {
        userName: username,
        newPassword: newPassword,
      });

      // Redirect to signin page upon successful password reset
      navigate('/Signin');
      toast.success('Password Reset. Login with your new Password');
    } catch (error) {
      handleError(error);
      toast.error('An Error occurred. Try again later');
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

  const validatePassword = (password) => {
    const digitRegex = /\d/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const specialCharRegex = /[@#$%^&+=!]/;
    const minLength = password.length >= 8;

    if (!digitRegex.test(password)) {
      return 'At least 1 digit is required.';
    } else if (!upperCaseRegex.test(password)) {
      return 'At least 1 uppercase letter is required.';
    } else if (!lowerCaseRegex.test(password)) {
      return 'At least 1 lowercase letter is required.';
    } else if (!specialCharRegex.test(password)) {
      return 'At least 1 special character is required.';
    } else if (!minLength) {
      return 'Password should be at least 8 characters long.';
    }

    return '';
  };

  const clearErrorsOnTyping = (name, value) => {
    switch (name) {
      case 'username':
        setOtpError('');
        break;
      case 'otp':
        if (/^\d{7}$/.test(value)) {
          setOtpError('');
        }
        break;
      case 'newPassword':
        setNewPasswordError('');
        break;
      case 'confirmNewPassword':
        setConfirmNewPasswordError('');
        break;
      default:
        break;
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'username':
        // Additional validation can be added here if needed
        break;
      case 'otp':
        if (!/^\d{7}$/.test(value)) {
          setOtpError('Invalid OTP format');
        }
        break;
      case 'newPassword':
        setNewPasswordError(validatePassword(value));
        break;
      case 'confirmNewPassword':
        if (value !== newPassword) {
          setConfirmNewPasswordError('Passwords do not match.');
        }
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'otp':
        setOtp(value);
        clearErrorsOnTyping('otp', value);
        break;
      case 'newPassword':
        setNewPassword(value);
        clearErrorsOnTyping('newPassword', value);
        break;
      case 'confirmNewPassword':
        setConfirmNewPassword(value);
        clearErrorsOnTyping('confirmNewPassword', value);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      <div className='signup_container'>
        <div className='right-panel'>
          <div className='signup-header'>
            <div className='signup-text'>{isOtpVerified ? 'Reset Password' : 'Forgot Password'}</div>
            <div className='signup-underline'></div>
          </div>
          <div className='signup-inputs'>
            <div className='signup-input'>
              <img src={user_icon} alt='' />
              <input
                type='text'
                placeholder='Username'
                name='username'
                value={username}
                onChange={(e) => handleInputChange(e)}
                onBlur={handleInputBlur}
                required
                disabled={isUsernameSubmitted}
              />
            </div>
            {isUsernameSubmitted && (
              <>
                <div className='signup-input'>
                  <img src={password_icon} alt='' />
                  <input
                    type='text'
                    placeholder='OTP Code'
                    name='otp'
                    value={otp}
                    onChange={(e) => handleInputChange(e)}
                    onBlur={handleInputBlur}
                    required
                    disabled={isOtpVerified}
                  />
                </div>
                <div>
                  {otpError && <div className='signup-error-box'>{otpError}</div>}
                </div>
              </>
            )}
            {isOtpVerified && (
              <>
                <div className='signup-input'>
                  <img src={password_icon} alt='' />
                  <input
                    type='password'
                    placeholder='Enter new Password'
                    name='newPassword'
                    value={newPassword}
                    onChange={(e) => handleInputChange(e)}
                    onBlur={handleInputBlur}
                    required
                  />
                </div>
                <div>
                  {newPasswordError && <div className='signup-error-box'>{newPasswordError}</div>}
                </div>
                <div className='signup-input'>
                  <img src={password_icon} alt='' />
                  <input
                    type='password'
                    placeholder='Confirm new Password'
                    name='confirmNewPassword'
                    value={confirmNewPassword}
                    onChange={(e) => handleInputChange(e)}
                    onBlur={handleInputBlur}
                    required
                  />
                </div>
                <div>
                  {confirmNewPasswordError && (
                    <div className='signup-error-box'>{confirmNewPasswordError}</div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className='signup-submit-container'>
            <div
              className='signup-submit'
              onClick={
                isOtpVerified ? handlePasswordReset : isUsernameSubmitted ? handleVerifyOtp : handleSendVerification
              }
            >
              {isOtpVerified ? 'Reset Password' : isUsernameSubmitted ? 'Verify Email' : 'Add Verification'}
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default ForgotPass;
