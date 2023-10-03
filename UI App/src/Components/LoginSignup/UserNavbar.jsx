// HomeNavbar.js

import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

import './HomeNavbar.css';

function HomeNavbar() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the JWT token is present in local storage
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      // If the token is not present, show a toast and redirect to the login page
      toast.error('Login and then access the Home page');
      navigate('/Signin');
    }
  }, [navigate]);

  const token = localStorage.getItem('jwtToken');
  const tokenPayload = jwt_decode(token);
  const userName = tokenPayload.userName;

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    toast.success('Logged out successfully');
    navigate('/Signin');
  };

  return (
    <>
      {/* Navbar Start */}
      <nav className="navbar navbar-expand-lg bg-secondary navbar-dark sticky-top py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
        <a href="/" className="navbar-brand ms-4 ms-lg-0">
          <img src="./img/logo.png" alt="Formula 1 Fan Hub Logo" className="logo" />
          <h1 className="mb-0 text-primary text-uppercase">Formula 1 Fan Hub</h1>
        </a>
        <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <a href="/" className="nav-item nav-link active">
              Home
            </a>
            <a href="/About" className="nav-item nav-link">
              About
            </a>
            <a href="/" className="nav-item nav-link">
              Service
            </a>
            <div className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                Pages
              </a>
              <div className="dropdown-menu m-0">
                <a href="/" className="dropdown-item">
                  Pricing Plan
                </a>
                <a href="/" className="dropdown-item">
                  Our Barber
                </a>
                <a href="/" className="dropdown-item">
                  Working Hours
                </a>
                <a href="/" className="dropdown-item">
                  Testimonial
                </a>
                <a href="/" className="dropdown-item">
                  404 Page
                </a>
              </div>
            </div>
            <a href="/Signin" className="nav-item nav-link">
              Drivers
            </a>
          </div>
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              {userName}
            </a>
            <div className="dropdown-menu m-0">
              <div className='dropdown-item'><Link to="/UserViewProfile">View Profile</Link></div>
              <div className='dropdown-item'><Link to="/">Settings</Link></div>
              <div className='dropdown-item' onClick={handleLogout}><Link to="/">Logout</Link></div>
            </div>
          </div>
        </div>
      </nav>
      {/* Navbar End */}
    </>
  );
}

export default HomeNavbar;
