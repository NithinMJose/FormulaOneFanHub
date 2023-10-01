import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import user_icon from '../Assets/abc.png';
import email_icon from '../Assets/def.png';
import password_icon from '../Assets/ghi.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';

const Signup = () => {
  const [uname, setUName] = useState('');
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [cpass, setCPass] = useState('');
  const [loading, setLoading] = useState(false);

  const [unameError, setUNameError] = useState('');
  const [fnameError, setFNameError] = useState('');
  const [lnameError, setLNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [cpassError, setCPassError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate('/UserHome');
    }
  }, [navigate]);

  const handleSave = async () => {
    if (!uname || !fname || !lname || !email || !pass || !cpass) {
      toast.error('Please enter all details.');
      return;
    }

    if (pass !== cpass) {
      toast.error('Passwords do not match. Please check your inputs.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Not a valid email format');
      return;
    }

    const passwordValidationResult = validatePassword(pass);
    if (passwordValidationResult) {
      setPassError(passwordValidationResult);
      return;
    }

    const url = 'https://localhost:7092/api/User/Register';

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

  const clearForm = () => {
    setUName('');
    setFName('');
    setLName('');
    setEmail('');
    setPass('');
    setCPass('');
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
      <div className='container'>
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
            </div>
            {unameError && <div className='error-box'>{unameError}</div>}
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
            </div>
            {fnameError && <div className='error-box'>{fnameError}</div>}
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
            </div>
            {lnameError && <div className='error-box'>{lnameError}</div>}
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
            </div>
            {emailError && <div className='error-box'>{emailError}</div>}
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
            </div>
            {passError && <div className='error-box'>{passError}</div>}
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
            </div>
            {cpassError && <div className='error-box'>{cpassError}</div>}
          </div>
          <div className='submit-container'>
            <div className='submit' onClick={handleSave} disabled={loading}>
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
