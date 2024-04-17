import React, { useState } from 'react';
import './Signup.css';
import userIcon from '../Assets/abc.png';
import emailIcon from '../Assets/def.png';
import passwordIcon from '../Assets/ghi.png';
import phoneIcon from '../Assets/a.jpg';
import addressIcon from '../Assets/b.jpg';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
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
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    clearErrorsOnTyping(name, value);

    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'otp':
        setOtp(value);
        break;
      default:
        break;
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    clearErrorsOnTyping(name, value);
  };

  const handleSave = async () => {
    // Check if there are existing error messages
    if (
      usernameError ||
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      phoneError ||
      addressError
    ) {
      toast.error('Check your inputs first.');
      return;
    }
  
    if (!username || !firstName || !lastName || !email || !password || !confirmPassword || !phone || !address) {
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
  
    validatePhone(phone, setPhoneError);
    validateAddress(address, setAddressError);
  
    const url = `${BASE_URL}/api/User/TestEndPoint`;
  
    setLoading(true);
  
    try {
      const response = await axios.post(url, {
        userName: username,
        password: password,
        confirmPassword: confirmPassword,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
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
          phone,
          address,
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

    const url = `${BASE_URL}/api/User/Register`;

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
        navigate('/Signin');
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
        if (validateOtp(value)) {
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

  const validatePhone = (phone, setError) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Invalid phone number format. Please enter a 10-digit number.');
    } else {
      setError('');
    }
  };
  
  const validateAddress = (address, setError) => {
    // You can add your own validation logic for the address field
    // For now, let's just check if it's not empty
    if (!address.trim()) {
      setError('Address cannot be empty.');
    } else {
      setError('');
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

  const handleInputClick = (name) => {
    switch (name) {
      case 'username':
        setUsernameError('Only alphabets, minimum 4 characters');
        break;
      case 'firstName':
        setFirstNameError('Only alphabets are allowed');
        break;
      case 'lastName':
        setLastNameError('Minimum 4 characters required');
        break;
      case 'email':
        setEmailError('Not a valid email format');
        break;
      case 'password':
        setPasswordError(
          'At least 1 digit, 1 uppercase letter, 1 lowercase letter, 1 special character, and minimum 8 characters required.'
        );
        break;
      case 'confirmPassword':
        setConfirmPasswordError('Passwords do not match.');
        break;
      case 'otp':
        setOtpError('Invalid OTP format');
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
                onClick={() => handleInputClick('username')}
                onChange={(e) => handleInputChange(e)}
                onBlur={handleInputBlur}
                required
                disabled={showConfirmationFields}
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
                onClick={() => handleInputClick('firstName')}
                onChange={(e) => handleInputChange(e)}
                onBlur={handleInputBlur}
                required
                disabled={showConfirmationFields}
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
                onClick={() => handleInputClick('lastName')}
                onChange={(e) => handleInputChange(e)}
                onBlur={handleInputBlur}
                required
                disabled={showConfirmationFields}
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
                onClick={() => handleInputClick('email')}
                onChange={(e) => handleInputChange(e)}
                onBlur={handleInputBlur}
                required
                disabled={showConfirmationFields}
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
                onClick={() => handleInputClick('password')}
                onChange={(e) => handleInputChange(e)}
                minLength='8'
                onBlur={handleInputBlur}
                required
                disabled={showConfirmationFields}
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
                onClick={() => handleInputClick('confirmPassword')}
                onChange={(e) => handleInputChange(e)}
                minLength='8'
                onBlur={handleInputBlur}
                required
                disabled={showConfirmationFields}
              />
            </div>
            {confirmPasswordError && (
              <div className='signup-error-box'>{confirmPasswordError}</div>
            )}

            {showConfirmationFields && (
              <>
                <div>
                  <div className='signup-input'>
                    <input
                      type='text'
                      placeholder='Enter OTP'
                      name='otp'
                      value={otp}
                      onClick={() => handleInputClick('otp')}
                      onChange={(e) => handleInputChange(e)}
                      onBlur={handleInputBlur}
                      required
                    />
                  </div>
                  <div>
                    {getErrorState('otp') && (
                      <div className='signup-error-box'>{getErrorState('otp')}</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='signup-submit-container'>
            <div
              className='signup-submit'
              onClick={showConfirmationFields ? handleVerifyEmail : handleSave}
              disabled={loading}
            >
              {loading ? 'Processing...' : showConfirmationFields ? 'Verify Email' : 'Sign Up'}
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
