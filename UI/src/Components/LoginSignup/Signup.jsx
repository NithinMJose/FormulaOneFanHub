import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import user_icon from '../Assets/abc.png';
import email_icon from '../Assets/def.png';
import password_icon from '../Assets/ghi.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();

  // State variables to store form input values
  const [uname, setUName] = useState('');
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [cpass, setCPass] = useState('');
  const [loading, setLoading] = useState(false);

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
      toast.error('Invalid email format. Please enter a valid email address.');
      return;
    }

    // Validate password format
    if (!validatePassword(pass)) {
      toast.error('Password should contain at least 1 numeric, 1 uppercase, 1 lowercase, and 1 special character.');
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
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
    return passwordRegex.test(password);
  };

  return (
      <div className='container'>
        <div className="header">
          <div className="text">Sign Up</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder='User Name'
                   value={uname} onChange={(e)=> setUName(e.target.value)} required />
          </div>
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder='First Name'
                   value={fname} onChange={(e)=> setFName(e.target.value)} required />
          </div>
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder='Last Name'
                   value={lname} onChange={(e)=> setLName(e.target.value)} required />
          </div>
          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" placeholder='Email'
                   value={email} onChange={(e)=> setEmail(e.target.value)}
                   required />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" placeholder='Password'
                   value={pass} onChange={(e)=> setPass(e.target.value)} minLength="8" required />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" placeholder='Confirm Password'
                   value={cpass} onChange={(e)=> setCPass(e.target.value)} minLength="8" required />
          </div>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleSave} disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </div>
          <Link to="/Signin" style={{ textDecoration: 'none'}}>
            <div className="submit-red">Sign In</div>
          </Link>
        </div>
      </div>
  );
};

export default Signup;
