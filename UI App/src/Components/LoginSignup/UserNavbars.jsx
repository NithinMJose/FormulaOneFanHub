//UserNavbar.jsx


import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

import './UserNavbar.css';

function UserNavbars() {
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
      <nav className="modern-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h1 className="brand-name">Formula 1 Fan Hub</h1>
          </div>
          <ul className="navbar-links">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/UserSelectCategory" className="nav-link">Store</Link></li>
            <li><Link to="/GalleryUserView" className="nav-link">Gallery</Link></li>
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Ticket Booking</span>
              <div className="dropdown-menu m-0">
                <Link to="/TBSeason" className="dropdown-item">Book New Ticket</Link>
                <Link to="/UserActiveTBHistory" className="dropdown-item">Show Active Bookings</Link>
                <Link to="/UserTBHistory" className="dropdown-item">Show Booking History</Link>
              </div>
            </li>
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">History</span>
              <div className="dropdown-menu m-0">
                <Link to="/TeamHistoryUserView" className="dropdown-item">Team History</Link>
                <Link to="/F1HistoryUserView" className="dropdown-item">F1 History</Link>
              </div>
            </li>
            <li><Link to="/TopicListUser" className="nav-link">Open Forum</Link></li>
            <li><Link to="/PollListUser" className="nav-link">Poll</Link></li>
            <li><Link to="/DriverListUser" className="nav-link">Drivers</Link></li>
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">{userName}</span>
              <div className="dropdown-menu m-0">
                <div className='dropdown-item'><Link to="/UserViewProfile">View Profile</Link></div>
                <div className='dropdown-item' onClick={handleLogout}><Link to="/">Logout</Link></div>
                <div className='dropdown-item'><Link to="/UserCart">Cart</Link></div>
                <div className='dropdown-item'><Link to="/UserWishList">Wish List</Link></div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      {/* Navbar End */}
    </>
  );
}

export default UserNavbars;
