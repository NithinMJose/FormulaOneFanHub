// Register.jsx
import React, { useState } from 'react';
import './Signup.css';
import userIcon from '../Assets/abc.png';
import emailIcon from '../Assets/def.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    validateName(username, setUsernameError, 'Username');
    validateName(firstName, setFirstNameError, 'First Name');
    validateName(lastName, setLastNameError, 'Last Name');
    validateEmail(email, setEmailError);

  };

  const handleSave = async () => {
    validateForm();

    if (!usernameError && !firstNameError && !lastNameError && !emailError && !isUsernameTaken) {
      // Check if any field is empty before proceeding
      if (!username || !firstName || !lastName || !email) {
        toast.error('All fields are required to be filled');
        return; // Stop execution if any field is empty
      }

      setLoading(true);
      try {
        const response = await fetch('https://localhost:7092/api/User/RegisterOne', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: username,
            firstName,
            lastName,
            email,
            password: '', // or null, depending on server requirements
            confirmPassword: '', // or null, depending on server requirements
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Registration success:', data);
          navigate('/Registertwo', { replace: true, state: { ...data.user } });
        } else {
          const errorData = await response.json();
          console.error('Registration error:', errorData);
          toast.error('Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const validateName = (name, setError, fieldName) => {
    const nameRegex = /^[A-Za-z]+$/;
    const minLength = name.length >= 3;

    if (!nameRegex.test(name) && !minLength) {
      setError(`${fieldName}: Only alphabets, minimum 3 characters`);
    } else if (!nameRegex.test(name)) {
      setError(`${fieldName}: Only alphabets are allowed`);
    } else if (!minLength) {
      setError(`${fieldName}: Minimum 3 characters required`);
    } else {
      setError('');
    }
  };

  const validateEmail = (email, setError) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError('Email: Not a valid email format');
    } else {
      setError('');
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'username':
        setUsername(value);
        validateName(value, setUsernameError, 'Username');
        try {
          const response = await fetch(`https://localhost:7092/api/User/CheckUsernameAvailability?username=${value}`);
          if (response.ok) {
            const data = await response.json();
            setIsUsernameTaken(data.isUsernameTaken);
            setIsUsernameAvailable(!data.isUsernameTaken && validateUsername(value)); // Set isUsernameAvailable based on the availability and additional validation
          }
        } catch (error) {
          console.error('Error checking username availability:', error);
        }
        break;
      case 'firstName':
        setFirstName(value);
        validateName(value, setFirstNameError, 'First Name');
        setIsUsernameAvailable(false); // Reset isUsernameAvailable if the field is changed
        break;
      case 'lastName':
        setLastName(value);
        validateName(value, setLastNameError, 'Last Name');
        setIsUsernameAvailable(false); // Reset isUsernameAvailable if the field is changed
        break;
      case 'email':
        setEmail(value);
        validateEmail(value, setEmailError);
        setIsUsernameAvailable(false); // Reset isUsernameAvailable if the field is changed
        break;
      default:
        break;
    }
  };

  // Add a function to validate the username
  const validateUsername = (username) => {
    const nameRegex = /^[A-Za-z]+$/;
    const minLength = username.length >= 3;
    return nameRegex.test(username) && minLength;
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
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
            </div>
            {(usernameError || isUsernameTaken) && (
              <div className='signup-error-box'>{isUsernameTaken ? 'Username is already in use' : usernameError}</div>
            )}
            {(isUsernameAvailable) && (
              <div className='signup-success-box'>Username is available</div>
            )}
            <div className='signup-input'>
              <img src={userIcon} alt='' />
              <input
                type='text'
                placeholder='First Name'
                name='firstName'
                value={firstName}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </div>
            {emailError && <div className='signup-error-box'>{emailError}</div>}
          </div>
          <div className='signup-submit-container'>
            <div className='signup-submit' onClick={handleSave} disabled={loading}>
              {loading ? 'Processing...' : 'Sign Up'}
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

export default Register;
