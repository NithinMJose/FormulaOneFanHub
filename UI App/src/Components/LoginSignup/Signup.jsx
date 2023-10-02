import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate('/UserHome');
    }
  }, [navigate]);

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

    const url = 'https://localhost:7092/api/User/Register';

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
        toast.success('User registered successfully, Please Login to continue');
        navigate('/Signin');
      } else {
        toast.error('Registration failed. Please check your inputs.');
      }
    } catch (error) {
      console.error('Axios error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const clearErrorsOnTyping = (name, value) => {
    // Check validation conditions and clear error if satisfied
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
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle input change
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
                value={username}
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
                value={firstName}
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
                value={lastName}
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
                value={email}
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
                value={password}
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
                value={confirmPassword}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                minLength='8'
                onBlur={handleInputBlur}
                required
              />
            </div>
            {confirmPasswordError && <div className='signup-error-box'>{confirmPasswordError}</div>}
          </div>
          <div className='signup-submit-container'>
            <div className='signup-submit' onClick={handleSave} disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
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
