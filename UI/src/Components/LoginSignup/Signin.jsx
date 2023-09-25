import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import user_icon from '../Assets/abc.png';
import password_icon from '../Assets/ghi.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from 'jwt-decode';

const Signin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        const roleId = tokenPayload["RoleId"];

        toast.success('Login successful');

        // Navigate based on the RoleId
        if (roleId === "1") {
          navigate('/AdminHome'); // Navigate to AdminHome if RoleId is 1
        } else if (roleId === "2") {
          navigate('/UserHome'); // Navigate to UserHome if RoleId is 2
        } else {
          navigate('/Home'); // Default navigation for other RoleIds
        }
      } else {
        toast.error('Password is incorrect');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        toast.error('Invalid username or password');
      } else if (
          error.response &&
          error.response.data === 'Username is already taken'
      ) {
        toast.error('Username already in use, please try using another one');
      } else {
        toast.error('An error occurred during login');
      }
    }
  };

  return (
      <div className='container'>
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="" />
            <input
                type="text"
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="forgot-password">
          Lost Password ? <span>Click Here !</span>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleLogin}>
            Login
          </div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="submit-red">Sign Up</div>
          </Link>
        </div>
      </div>
  );
};

export default Signin;
