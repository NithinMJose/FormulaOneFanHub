import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import user_icon from '../Assets/abc.png';
import email_icon from '../Assets/def.png';
import password_icon from '../Assets/ghi.png';
import car_icon2 from '../Assets/c.jpg'; // Import the new background image
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there is a valid token in localStorage
    const token = localStorage.getItem('jwtToken');

    if (token) {
      // Redirect to UserHome if a valid token exists
      navigate('/UserHome');
    }
  }, [navigate]);

  // State variables to store form input values
  const [uname, setUName] = useState('');
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [cpass, setCPass] = useState('');
  const [loading, setLoading] = useState(false);

  // Error message states for each field
  const [unameError, setUNameError] = useState('');
  const [fnameError, setFNameError] = useState('');
  const [lnameError, setLNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [cpassError, setCPassError] = useState('');

  // Function to handle form submission
  const handleSave = async () => {
    // Check if any field is empty
    if (!uname || !fname || !lname || !email || !pass || !cpass) {
      toast.error('Please enter all details.');
      return;
    }

    if (pass !== cpass) {
      toast.error('Passwords do not match. Please check your inputs.');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError('Not a valid email format');
      return;
    }

    // Validate password format
    const passwordValidationResult = validatePassword(pass);
    if (passwordValidationResult) {
      setPassError(passwordValidationResult);
      return;
    }

    // Additional form validation can be added here

    const url = 'https://localhost:7092/api/User/Register'; // Updated to use HTTPS

    setLoading(true);

    try {
      const response = await axios.post(url, {
        userName: uname,
        password: pass,
        confirmPassword: cpass,
        email: email,
        firstName: fname,
        lastName: lname,
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

  // Rest of your component code...

  // Function to clear the form input values
  const clearForm = () => {
    setUName('');
    setFName('');
    setLName('');
    setEmail('');
    setPass('');
    setCPass('');
  };

  // Email format validation function
  const validateEmail = (email) => {
    // Use a regular expression to validate the email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  // Function to validate password format
  const validatePassword = (password) => {
    // Password format conditions
    const digitRegex = /\d/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const specialCharRegex = /[@#$%^&+=!]/;
    const minLength = password.length >= 8;

    // Validate each condition and return the error message for the first unmet condition
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

    // Return an empty string if all conditions are met
    return '';
  };

  // Function to handle input blur event and show/remove error messages
  const handleInputBlur = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'uname':
        validateName(value, setUNameError);
        break;
      case 'fname':
        validateName(value, setFNameError);
        break;
      case 'lname':
        validateName(value, setLNameError);
        break;
      case 'email':
        if (!validateEmail(value)) {
          setEmailError('Not a valid email format');
        } else {
          setEmailError('');
        }
        break;
      case 'pass':
        setPassError(validatePassword(value));
        break;
      case 'cpass':
        if (value !== pass) {
          setCPassError('Passwords do not match.');
        } else {
          setCPassError('');
        }
        break;
      default:
        break;
    }
  };

  // Function to handle input change event and remove error messages
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'uname':
        validateName(value, setUNameError);
        break;
      case 'fname':
        validateName(value, setFNameError);
        break;
      case 'lname':
        validateName(value, setLNameError);
        break;
      case 'email':
        if (!validateEmail(value)) {
          setEmailError('Not a valid email format');
        } else {
          setEmailError('');
        }
        break;
      case 'pass':
        setPassError(validatePassword(value));
        break;
      case 'cpass':
        if (value !== pass) {
          setCPassError('Passwords do not match.');
        } else {
          setCPassError('');
        }
        break;
      default:
        break;
    }
  };

  // Function to validate name format (only alphabets, minimum 4 characters)
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

  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      
      <div className='container' style={{ backgroundImage: `url(${car_icon2})` }}>
        <div className='right-panel'>
          <div className='header'>
            <div className='text'>Sign Up</div>
            <div className='underline'></div>
          </div>
          <div className='inputs'>
            <div className='input'>
              <img src={user_icon} alt='' />
              <input
                type='text'
                placeholder='User Name'
                name='uname'
                value={uname}
                onChange={(e) => setUName(e.target.value)}
                onBlur={handleInputBlur}
                required
              />
              {unameError && <div className='error-box'>{unameError}</div>}
            </div>
            <div className='input'>
              <img src={user_icon} alt='' />
              <input
                type='text'
                placeholder='First Name'
                name='fname'
                value={fname}
                onChange={(e) => setFName(e.target.value)}
                onBlur={handleInputBlur}
                required
              />
              {fnameError && <div className='error-box'>{fnameError}</div>}
            </div>
            <div className='input'>
              <img src={user_icon} alt='' />
              <input
                type='text'
                placeholder='Last Name'
                name='lname'
                value={lname}
                onChange={(e) => setLName(e.target.value)}
                onBlur={handleInputBlur}
                required
              />
              {lnameError && <div className='error-box'>{lnameError}</div>}
            </div>
            <div className='input'>
              <img src={email_icon} alt='' />
              <input
                type='email'
                placeholder='Email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleInputBlur}
                required
              />
              {emailError && <div className='error-box'>{emailError}</div>}
            </div>
            <div className='input'>
              <img src={password_icon} alt='' />
              <input
                type='password'
                placeholder='Password'
                name='pass'
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                minLength='8'
                onBlur={handleInputBlur}
                required
              />
              {passError && <div className='error-box'>{passError}</div>}
            </div>
            <div className='input'>
              <img src={password_icon} alt='' />
              <input
                type='password'
                placeholder='Confirm Password'
                name='cpass'
                value={cpass}
                onChange={(e) => setCPass(e.target.value)}
                minLength='8'
                onBlur={handleInputBlur}
                required
              />
              {cpassError && <div className='error-box'>{cpassError}</div>}
            </div>
          </div>
          <div className='submit-container'>
            <div className='submit' onClick={handleSave} disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </div>
            <Link to='/Signin' style={{ textDecoration: 'none' }}>
              <div className='submit-red'>Sign In</div>
            </Link>
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
