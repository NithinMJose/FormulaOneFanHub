import React, { useState } from 'react';
import './Signup.css';
import userIcon from '../Assets/abc.png';
import emailIcon from '../Assets/def.png';
import passwordIcon from '../Assets/ghi.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmationFields, setShowConfirmationFields] = useState(false);

  const [storedFormData, setStoredFormData] = useState(null);

  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleSave = async () => {
    if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error('Please enter all details.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please check your inputs.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Not a valid email format');
      return;
    }

    const passwordValidationResult = validatePassword(password);
    if (passwordValidationResult) {
      setPasswordError(passwordValidationResult);
      return;
    }

    const url = 'https://localhost:7092/api/User/TestEndPoint';

    setLoading(true);

    try {
      const response = await axios.post(url, {
        userName: username,
        password: password,
        confirmPassword: confirmPassword,
        email: email,
        firstName: firstName,
        lastName: lastName,
      });

      if (response.data.success) {
        clearForm();
        toast.success('Please check your email for OTP to confirm your registration.');
        setStoredFormData({
          username,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          confirmEmailToken: response.data.user.confirmEmailToken,
        });
        setShowConfirmationFields(true);
      } else {
        toast.error('Registration failed. Please check your inputs.');
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data === 'Username is already taken'
      ) {
        toast.error('Username is already in use. Please choose another one.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!otp || !validateOtp(otp)) {
      setOtpError('Invalid OTP format');
      return;
    }
  
    if (otp !== storedFormData.confirmEmailToken) {
      setOtpError('Incorrect OTP. Please enter the correct OTP.');
      return;
    }
  
    const url = 'https://localhost:7092/api/User/Register';
  
    try {
      const response = await axios.post(url, {
        userName: storedFormData.username,
        password: storedFormData.password,
        confirmPassword: storedFormData.confirmPassword,
        email: storedFormData.email,
        firstName: storedFormData.firstName,
        lastName: storedFormData.lastName,
        otp: otp,
      });
  
      if (response.data.success) {
        toast.success('Registration completed successfully!');
        // You can navigate to a different page or perform other actions upon successful registration.
      } else {
        toast.error('Registration failed. Please check your inputs.');
      }
    } catch (error) {
      // Handle API call errors
      console.error('Error during registration:', error);
    }
  };
  
  
  const validateOtp = (otp) => {
    return /^\d{7}$/.test(otp);
  };

  const clearErrorsOnTyping = (name, value) => {
    switch (name) {
      case 'username':
        validateName(value, setUsernameError);
        break;
      case 'firstName':
        validateName(value, setFirstNameError);
        break;
      case 'lastName':
        validateName(value, setLastNameError);
        break;
      case 'email':
        if (validateEmail(value)) {
          setEmailError('');
        }
        break;
      case 'password':
        const passwordValidationResult = validatePassword(value);
        if (!passwordValidationResult) {
          setPasswordError('');
        }
        break;
      case 'confirmPassword':
        if (value === password) {
          setConfirmPasswordError('');
        }
        break;
      case 'otp':
        if (/^\d{6}$/.test(value)) {
          setOtpError('');
        }
        break;
      default:
        break;
    }
  };

  const getErrorState = (name) => {
    switch (name) {
      case 'username':
        return usernameError;
      case 'firstName':
        return firstNameError;
      case 'lastName':
        return lastNameError;
      case 'email':
        return emailError;
      case 'password':
        return passwordError;
      case 'confirmPassword':
        return confirmPasswordError;
      case 'otp':
        return otpError;
      default:
        return null;
    }
  };

  const clearForm = () => {
    setUsername('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
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

  const validateName = (name, setError) => {
    const nameRegex = /^[A-Za-z]+$/;
    const minLength = name.length >= 4;

    if (!nameRegex.test(name) && !minLength) {
      setError('Only alphabets, minimum 4 characters');
    } else if (!nameRegex.test(name)) {
      setError('Only alphabets are allowed');
    } else if (!minLength) {
      setError('Minimum 4 characters required');
    } else {
      setError('');
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'username':
        validateName(value, setUsernameError);
        break;
      case 'firstName':
        validateName(value, setFirstNameError);
        break;
      case 'lastName':
        validateName(value, setLastNameError);
        break;
      case 'email':
        if (!validateEmail(value)) {
          setEmailError('Not a valid email format');
        } else {
          setEmailError('');
        }
        break;
      case 'password':
        setPasswordError(validatePassword(value));
        break;
      case 'confirmPassword':
        if (value !== password) {
          setConfirmPasswordError('Passwords do not match.');
        } else {
          setConfirmPasswordError('');
        }
        break;
      case 'otp':
        clearErrorsOnTyping('otp', value);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'username':
        clearErrorsOnTyping('username', value);
        setUsername(value);
        break;
      case 'firstName':
        clearErrorsOnTyping('firstName', value);
        setFirstName(value);
        break;
      case 'lastName':
        clearErrorsOnTyping('lastName', value);
        setLastName(value);
        break;
      case 'email':
        clearErrorsOnTyping('email', value);
        setEmail(value);
        break;
      case 'password':
        clearErrorsOnTyping('password', value);
        setPassword(value);
        break;
      case 'confirmPassword':
        clearErrorsOnTyping('confirmPassword', value);
        setConfirmPassword(value);
        break;
      case 'otp':
        setOtp(value);
        clearErrorsOnTyping('otp', value);
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
            <div className='signup-text'>Sign Up</div>
            <div className='signup-underline'></div>
          </div>
          <div className='signup-inputs'>
            <div className='signup-input'>
              <img src={userIcon} alt='' />
              <input
                type='text'
                placeholder='Username'
                name='username'
                value={showConfirmationFields ? storedFormData?.username : username}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onBlur={handleInputBlur}
                required
              />
            </div>
            {usernameError && <div className='signup-error-box'>{usernameError}</div>}
            <div className='signup-input'>
              <img src={userIcon} alt='' />
              <input
                type='text'
                placeholder='First Name'
                name='firstName'
                value={showConfirmationFields ? storedFormData?.firstName : firstName}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onBlur={handleInputBlur}
                required
              />
            </div>
            {firstNameError && <div className='signup-error-box'>{firstNameError}</div>}
            <div className='signup-input'>
              <img src={userIcon} alt='' />
              <input
                type='text'
                placeholder='Last Name'
                name='lastName'
                value={showConfirmationFields ? storedFormData?.lastName : lastName}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onBlur={handleInputBlur}
                required
              />
            </div>
            {lastNameError && <div className='signup-error-box'>{lastNameError}</div>}
            <div className='signup-input'>
              <img src={emailIcon} alt='' />
              <input
                type='email'
                placeholder='Email'
                name='email'
                value={showConfirmationFields ? storedFormData?.email : email}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onBlur={handleInputBlur}
                required
              />
            </div>
            {emailError && <div className='signup-error-box'>{emailError}</div>}
            <div className='signup-input'>
              <img src={passwordIcon} alt='' />
              <input
                type='password'
                placeholder='Password'
                name='password'
                value={showConfirmationFields ? '********' : password}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                minLength='8'
                onBlur={handleInputBlur}
                required
              />
            </div>
            {passwordError && <div className='signup-error-box'>{passwordError}</div>}
            <div className='signup-input'>
              <img src={passwordIcon} alt='' />
              <input
                type='password'
                placeholder='Confirm Password'
                name='confirmPassword'
                value={showConfirmationFields ? '********' : confirmPassword}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                minLength='8'
                onBlur={handleInputBlur}
                required
              />
            </div>
            {confirmPasswordError && (
              <div className='signup-error-box'>{confirmPasswordError}</div>
            )}

            {showConfirmationFields && (
              <div>
                <div className='signup-input'>
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
                  {getErrorState('otp') && (
                    <div className='signup-error-box'>{getErrorState('otp')}</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className='signup-submit-container'>
            <div
              className='signup-submit'
              onClick={showConfirmationFields ? handleVerifyEmail : handleSave}
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : showConfirmationFields
                ? 'Verify Email'
                : 'Sign Up'}
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

export default Signup;
