import React, { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import userIcon from '../Assets/abc.png';
import emailIcon from '../Assets/def.png';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { BASE_URL } from '../../config';

const Register = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    validateName(username, setUsernameError, 'Username');
    validateName(firstName, setFirstNameError, 'First Name');
    validateName(lastName, setLastNameError, 'Last Name');
    validateEmail(email, setEmailError);
    validatePhoneNumber(contactNumber, setContactNumberError);
    validateAddress(address, setAddressError);
  };

  const handleSave = async () => {
    validateForm();

    if (!usernameError && !firstNameError && !lastNameError && !emailError && !contactNumberError && !addressError && !isUsernameTaken) {
      // Check if any field is empty before proceeding
      if (!username || !firstName || !lastName || !email || !contactNumber || !address) {
        toast.error('All fields are required to be filled');
        return; // Stop execution if any field is empty
      }

      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/User/RegisterOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: username,
            firstName,
            lastName,
            email,
            contactNumber,
            address,
            password: '', // or null, depending on server requirements
            confirmPassword: '', // or null, depending on server requirements
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Registration success:', data);
          navigate('/Registertwo', { replace: true, state: { ...data.user, address, contactNumber } });
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

  const validatePhoneNumber = (phoneNumber, setError) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Phone Number: Invalid format (10 digits required)');
    } else {
      setError('');
    }
  };

  const validateAddress = (address, setError) => {
    const minCharacters = 10;
    const trimmedAddress = address.trim(); // Remove leading and trailing whitespaces
  
    if (!trimmedAddress || trimmedAddress.length < minCharacters) {
      setError(`Address: Minimum ${minCharacters} non-whitespace characters required`);
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
          const response = await fetch(`${BASE_URL}/api/User/CheckUsernameAvailability?username=${value}`);
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
      case 'contactNumber':
        setContactNumber(value);
        validatePhoneNumber(value, setContactNumberError);
        setIsUsernameAvailable(false); // Reset isUsernameAvailable if the field is changed
        break;
      case 'address':
        setAddress(value);
        validateAddress(value, setAddressError);
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
            <div className='signup-text'>Create an Account</div>
            <div className='signup-underline'></div>
          </div>
          <div className='signup-inputs'>
            <TextField
              label='Username'
              variant='outlined'
              name='username'
              value={username}
              onChange={handleInputChange}
              autoComplete="off"
              fullWidth
            />
            {(usernameError || isUsernameTaken) && (
              <div className='signup-error-box'>{isUsernameTaken ? 'Username is already in use' : usernameError}</div>
            )}
            {(isUsernameAvailable) && (
              <div className='signup-success-box'>Username is available</div>
            )}
            <TextField
              label='First Name'
              variant='outlined'
              name='firstName'
              value={firstName}
              onChange={handleInputChange}
              fullWidth
            />
            {firstNameError && <div className='signup-error-box'>{firstNameError}</div>}
            <TextField
              label='Last Name'
              variant='outlined'
              name='lastName'
              value={lastName}
              onChange={handleInputChange}
              fullWidth
            />
            {lastNameError && <div className='signup-error-box'>{lastNameError}</div>}
            <TextField
              label='Email'
              variant='outlined'
              name='email'
              value={email}
              onChange={handleInputChange}
              fullWidth
            />
            {emailError && <div className='signup-error-box'>{emailError}</div>}
            <TextField
              label='Contact Number'
              variant='outlined'
              name='contactNumber'
              value={contactNumber}
              onChange={handleInputChange}
              fullWidth
            />
            {contactNumberError && <div className='signup-error-box'>{contactNumberError}</div>}
            <TextField
              label='Address'
              variant='outlined'
              name='address'
              value={address}
              onChange={handleInputChange}
              fullWidth
            />
            {addressError && <div className='signup-error-box'>{addressError}</div>}
          </div>
          <div className='signup-submit-container'>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSave}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress color='inherit' size={20} /> : 'Sign Up'}
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

export default Register;
