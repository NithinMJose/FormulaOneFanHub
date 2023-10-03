import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signin.css';
import user_icon from '../Assets/abc.png';
import password_icon from '../Assets/ghi.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from 'jwt-decode';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';

const Signin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if there is a valid token in localStorage
    const token = localStorage.getItem('jwtToken');

    if (token) {
      // Parse the token to get the RoleId
      const tokenPayload = jwt_decode(token);
      const roleId = tokenPayload['RoleId'];

      // Redirect based on the RoleId
      if (roleId === '1') {
        navigate('/AdminHome');
      } else if (roleId === '2') {
        navigate('/UserHome');
      } else {
        navigate('/Home');
      }
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7092/api/User/Login', {
        userName: username,
        password: password,
      });

      if (response.data.token) {
        // Store the token in local storage
        localStorage.setItem('jwtToken', response.data.token);

        // Parse the token to get the RoleId
        const tokenPayload = jwt_decode(response.data.token);
        const roleId = tokenPayload['RoleId'];

        toast.success('Login successful');

        // Navigate based on the RoleId
        if (roleId === '2') {
          navigate('/AdminHome');
        } else if (roleId === '1') {
          navigate('/UserHome');
        } else {
          navigate('/Home');
        }
      } else {
        toast.error('Password is incorrect');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        toast.error('Invalid username or password');
      } else if (error.response && error.response.data === 'Username is already taken') {
        toast.error('Username already in use, please try using another one');
      } else {
        toast.error('An error occurred during login');
      }
    }
  };

  // Adding some margin to push the footer down
  const containerStyle = {
    marginBottom: '20px', // Adjust this value as needed
  };

  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      <br />

      <div className="container2" style={containerStyle}>
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="forgot-password">
          Lost Password? <span>Click Here!</span>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleLogin}>
            Login
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default Signin;
