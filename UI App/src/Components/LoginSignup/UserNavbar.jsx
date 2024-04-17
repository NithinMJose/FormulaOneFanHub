//UserNavbar.jsx


import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

import './UserNavbar.css';

function UserNavbar() {
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
      <nav className="modernNavbarUser">
        <div className="navbar-container">
          <div className="navbar-brand">
            {/* <img src="./img/logo.png" alt="Formula 1 Fan Hub Logo" className="logo" /> */}
            <h1 className="brand-namess">Formula 1 Fan Hub</h1>
          </div>
          <ul className="navbar-links">
            <li><Link to="/" className="nav-links">Home</Link></li>
            
            <li className="nav-item dropdown">
              <span className="nav-links dropdown-toggle" data-bs-toggle="dropdown" name='StoreNavBar' >Store</span>
              <div className="dropdown-menu m-0">
                <Link to="/UserSelectCategory" className="dropdown-item" id='ExpStore' name='ExpStore' >Explore Store</Link>
                <Link to="/OrderHistory" className="dropdown-item">Purchase History</Link>
              </div>
            </li>
            
            <li><Link to="/GalleryUserView" className="nav-links">Gallery</Link></li>
            
            <li className="nav-item dropdown">
              <span className="nav-links dropdown-toggle" data-bs-toggle="dropdown">Ticket Booking</span>
              <div className="dropdown-menu m-0">
                <Link to="/TBSeason" className="dropdown-item">Book New Ticket</Link>
                <Link to="/UserActiveTBHistory" className="dropdown-item">Show Active Bookings</Link>
                <Link to="/UserTBHistory" className="dropdown-item">Show Booking History</Link>
              </div>
            </li>
            
            <li className="nav-item dropdown">
              <span className="nav-links dropdown-toggle" data-bs-toggle="dropdown">History</span>
              <div className="dropdown-menu m-0">
                <Link to="/TeamHistoryUserView" className="dropdown-item">Team History</Link>
                <Link to="/F1HistoryUserView" className="dropdown-item">F1 History</Link>
              </div>
            </li>
            
            <li><Link to="/TopicListUser" name='OpenForums' className="nav-links">Open Forum</Link></li>
            
            <li><Link to="/PollListUser" className="nav-links">Poll</Link></li>
            
            <li><Link to="/DriverListUser" className="nav-links">Drivers</Link></li>
            
            <li className="nav-item dropdown">
              <span className="nav-links dropdown-toggle" data-bs-toggle="dropdown">{userName}</span>
              <div className="dropdown-menu m-0">
                <Link to="/UserViewProfile" className="dropdown-item">View Profile</Link>
                <Link to="/UserCart" className="dropdown-item">Go to Cart</Link>
                <Link to="/UserWishList" className="dropdown-item">Wish List</Link>
                <Link to="/" className="dropdown-item" onClick={handleLogout}>Logout</Link>
              </div>
            
            </li>
          </ul>
        </div>
      </nav>
      {/* Navbar End */}
    </>
  );
}

export default UserNavbar;
