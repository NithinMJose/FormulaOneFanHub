import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import passwordIcon from '../Assets/ghi.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';


const Registerthree = () => {
  const location = useLocation();
  const { state } = location;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorColor, setErrorColor] = useState('');
  const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    validatePassword(password, setPasswordError);
    validateConfirmPassword(confirmPassword, password, setConfirmPasswordError);
  };

  const handleSave = async () => {
    validateForm();
    if ((!passwordError || passwordError === 'Strong password') && (!confirmPasswordError || confirmPasswordSuccess === 'Passwords match')) {
      try {
        const response = await fetch(`${BASE_URL}/api/User/RegisterUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: state.userName,
            firstName: state.firstName,
            lastName: state.lastName,
            email: state.email,
            otp: state.otpServer,
            contactNumber: state.contactNumber,
            address: state.address,
            password: password,
            confirmPassword: confirmPassword,
          }),
        });
  
        if (response.ok) {
          // Additional logic (API call, navigation, etc.) can be added here
          navigate('/Signin'); // Replace with the appropriate path after successful registration
        } else {
          // Handle error, show toast, etc.
          toast.error('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        // Handle error, show toast, etc.
        toast.error('An unexpected error occurred. Please try again later.');
      }
    } else {
      // Handle error, show toast, etc.
      toast.error('Please fix the errors before proceeding.');
    }
  };
  
  const validatePassword = (password, setError) => {
    const digitRegex = /\d/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const specialCharRegex = /[@#$%^&+=!]/;
    const minLength = password.length >= 8;

    if (!digitRegex.test(password)) {
      setError('Password: At least 1 digit is required.');
      setErrorColor('red');
    } else if (!upperCaseRegex.test(password)) {
      setError('Password: At least 1 uppercase letter is required.');
      setErrorColor('red');
    } else if (!lowerCaseRegex.test(password)) {
      setError('Password: At least 1 lowercase letter is required.');
      setErrorColor('red');
    } else if (!specialCharRegex.test(password)) {
      setError('Password: At least 1 special character is required.');
      setErrorColor('red');
    } else if (!minLength) {
      setError('Password: Should be at least 8 characters long.');
      setErrorColor('red');
    } else {
      setError('Strong password');
      // Set green color for success
      setErrorColor('green');
    }
  };

  const validateConfirmPassword = (confirmPassword, password, setError) => {
    if (confirmPassword !== password) {
      setError('Confirm Password: Passwords do not match.');
      setConfirmPasswordSuccess('');
    } else {
      setError('');
      setConfirmPasswordSuccess('Passwords match');
      // Set green color for success
      setErrorColor('green');
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'password':
        validatePassword(value, setPasswordError);
        break;
      case 'confirmPassword':
        validateConfirmPassword(value, password, setConfirmPasswordError);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'password':
        setPassword(value);
        validatePassword(value, setPasswordError);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        validateConfirmPassword(value, password, setConfirmPasswordError);
        break;
      default:
        break;
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      <div className='signup_container'>
        <div className='right-panel'>
          <div className='signup-header'>
            <div className='signup-text'>Create Password</div>
            <div className='signup-underline'></div>
            <p style={{ color: 'green', margin: '10px 0'}}>
              Please Choose a Strong password to keep your account secure.
            </p>
          </div>
          <div className='signup-inputs'>
            {/* Display label contents received from Register */}
            <div className='signup-label'>Username: {state.userName}</div>
            <div className='signup-label'>First Name: {state.firstName}</div>
            <div className='signup-label'>Last Name: {state.lastName}</div>
            <div className='signup-label'>Email: {state.email}</div>
            <div className='signup-label'>Contact: {state.contactNumber}</div>
            <div className='signup-label'>Address: {state.address}</div>

            

            <TextField
              type={showPassword ? 'text' : 'password'}
              label='Enter Password'
              variant='outlined'
              name='password'
              value={password}
              onChange={(e) => handleInputChange(e)}
              onBlur={handleInputBlur}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {passwordError && (
              <div className='signup-error-box' style={{ borderColor: errorColor, color: errorColor === 'green' ? 'green' : 'red' }}>
                {passwordError}
              </div>
            )}

            <TextField
              type='password'
              label='Confirm Password'
              variant='outlined'
              name='confirmPassword'
              value={confirmPassword}
              onChange={(e) => handleInputChange(e)}
              onBlur={handleInputBlur}
              fullWidth
              required
            />
            {confirmPasswordError && (
              <div className='signup-error-box'>{confirmPasswordError}</div>
            )}
            {confirmPasswordSuccess && (
              <div className='signup-success-box' style={{ borderColor: 'green', color: 'green' }}>
                {confirmPasswordSuccess}
              </div>
            )}
          </div>
          <div className='signup-submit-container'>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSave}
              fullWidth
            >
              Sign Up
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

export default Registerthree;
