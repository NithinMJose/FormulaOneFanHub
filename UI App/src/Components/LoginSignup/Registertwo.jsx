import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import otpIcon from '../Assets/abc.png';
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
    console.log('Entered OTP:', otp);
    if (!otpError && otp === state.otpServer) {
      navigate('/Registerthree', { replace: true, state: { ...state, otp } });
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const validateOtp = (otp, setError) => {
    const otpRegex = /^\d{7}$/;
    if (!otpRegex.test(otp)) {
      setError('Please enter a 7-digit number');
    } else {
      setError('');
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
            <Typography variant='h4'>Verify Email</Typography>
            <div className='signup-underline'></div>
            <Typography style={{ color: 'green', margin: '10px 0' }}>
              Please enter the 7-digit OTP number we have sent to your email to confirm your email
            </Typography>
          </div>
          <div className='signup-inputs'>
            <div className='signup-label'>Username: {state.userName}</div>
            <div className='signup-label'>First Name: {state.firstName}</div>
            <div className='signup-label'>Last Name: {state.lastName}</div>
            <div className='signup-label'>Email: {state.email}</div>
            <div className='signup-label'>Contact Number: {state.contactNumber}</div>
            <div className='signup-label'>Address: {state.address}</div>
            <TextField
              label='Enter OTP'
              variant='outlined'
              name='otp'
              value={otp}
              onChange={(e) => handleInputChange(e)}
              onBlur={() => validateOtp(otp, setOtpError)}
              fullWidth
              required
            />
            {otpError && <div className='signup-error-box'>{otpError}</div>}
          </div>
          <div className='signup-submit-container'>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSave}
              fullWidth
            >
              Continue
            </Button>
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
