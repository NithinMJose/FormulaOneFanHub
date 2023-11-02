import React, { useState } from 'react';
import './RegisterTwo.css';
import otpIcon from '../Assets/abc.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import { useNavigate, useLocation } from 'react-router-dom';

const Registertwo = () => {
  const location = useLocation();
  const { state } = location;

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
    validateOtp(otp, setOtpError);
  };

  const handleSave = () => {
    validateForm();
    if (!otpError && otp === state.confirmEmailToken) {
      // Additional logic (API call, navigation, etc.) can be added here
      navigate('/Registerthree', { replace: true, state: { ...state, otp } });
    } else {
      // Handle error, show toast, etc.
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const validateOtp = (otp, setError) => {
    const otpRegex = /^\d{7}$/;
    if (!otpRegex.test(otp)) {
      setError('OTP: Please enter a 7-digit number');
    } else {
      setError('');
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'otp':
        validateOtp(value, setOtpError);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'otp':
        setOtp(value);
        validateOtp(value, setOtpError);
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
        <div className='signup-text'>Verify Email</div>
        <div className='signup-underline'></div>
        <p style={{ color: 'green', margin: '10px 0'}}>
          Please enter the 7-digit OTP number we have sent to your email to confirm your email
        </p>
      </div>          
          <div className='signup-inputs'>
            {/* Display label contents received from Register */}
            <div className='signup-label'>Username: {state.userName}</div>
            <div className='signup-label'>First Name: {state.firstName}</div>
            <div className='signup-label'>Last Name: {state.lastName}</div>
            <div className='signup-label'>Email: {state.email}</div>
            <div className='signup-label'>OTP: {state.confirmEmailToken}</div>
            <div className='signup-input' style={{margin: '10px 0'}}>
              <img src={otpIcon} alt='' />
              <input
                type='text'
                placeholder='Enter OTP'
                name='otp'
                value={otp}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onBlur={handleInputBlur}
                required
              />
            </div>
            {otpError && <div className='signup-error-box'>{otpError}</div>}
          </div>
          <div className='signup-submit-container'>
            <div className='signup-submit' onClick={handleSave}>
              Continue
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

export default Registertwo;
