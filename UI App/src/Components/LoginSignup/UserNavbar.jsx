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
            <a href="/GalleryUserView" className="nav-item nav-link active">
              Gallery
            </a>

            <div className="nav-item dropdown">
              <a href="#" className="nav-item nav-link active" data-bs-toggle="dropdown">
              Ticket Booking
              </a>
              <div className="dropdown-menu m-0">
                <Link to="/TBSeason" className="dropdown-item">
                  Book New Ticket
                </Link>
                <Link to="/UserActiveTBHistory" className="dropdown-item">
                  Show Active Bookings
                </Link>
                <Link to="/UserTBHistory" className="dropdown-item">
                  Show Booking History
                </Link>
              </div>
            </div>

            <div className="nav-item dropdown">
              <a href="#" className="nav-item nav-link active" data-bs-toggle="dropdown">
              History
              </a>
              <div className="dropdown-menu m-0">
                <Link to="/TeamHistoryUserView" className="dropdown-item">
                  Team History
                </Link>
                <Link to="/F1HistoryUserView" className="dropdown-item">
                  F1 History
                </Link>
              </div>
            </div>

            <a href="/TopicListUser" className="nav-item nav-link active">
              Open Forum
            </a>

            <a href="/PollListUser" className="nav-item nav-link active">
              Poll
            </a>
            
            <a href="/DriverListUser" className="nav-item nav-link active">
              Drivers
            </a>
          </div>
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              {userName}
            </a>
            <div className="dropdown-menu m-0">
              <div className='dropdown-item'><Link to="/UserViewProfile">View Profile</Link></div>
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
