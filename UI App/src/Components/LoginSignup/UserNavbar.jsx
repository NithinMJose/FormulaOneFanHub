import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

import './HomeNavbar.css';

function HomeNavbar() {
  const history = useHistory();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('Login and then access the Home page');
      history.push('/Signin');
    } else {
      const tokenPayload = jwt_decode(token);
      setUserName(tokenPayload.userName);
    }
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    toast.success('Logged out successfully');
    history.push('/Signin');
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src="./img/logo.png" alt="Logo" className="logo" />
          <h1 className="brand-name">Formula 1 Fan Hub</h1>
        </div>
        <ul className="navbar-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/DriverListGuest" className="nav-link">Drivers</Link></li>
          <li><Link to="/F1HistoryGuestView" className="nav-link">F1 History</Link></li>
          <li><Link to="/TeamHistoryGuestView" className="nav-link">Team History</Link></li>
          <li><Link to="/GalleryGuestView" className="nav-link">Gallery</Link></li>
          <li className="nav-item dropdown">
            <div className="nav-link dropdown-toggle">{userName}</div>
            <ul className="dropdown-menu">
              <li><Link to="/UserViewProfile" className="dropdown-item">View Profile</Link></li>
              <li onClick={handleLogout} className="dropdown-item">Logout</li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default HomeNavbar;
