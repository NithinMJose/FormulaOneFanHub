import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import './DeliveryCompanyNavbar.css';

function DeliveryCompanyNavbar() {
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
  const CompanyName = tokenPayload.CompanyName;

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    toast.success('Logged out successfully');
    navigate('/Signin');
  };

  return (
    <>
      <nav className="modern-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <img src="./img/logo.png" alt="Formula 1 Fan Hub Logo" className="logo" />
            <h1 className="brand-name">Formula 1 Fan Hub</h1>
          </div>
          <ul className="navbar-links">

            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Store</span>
              <div className="dropdown-menu m-0">
                <Link to="/ListPendingOrders" className="dropdown-item">Pending Orders</Link>
                <Link to="/ListShippingOrders" className="dropdown-item">Shipping Orders</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">History</span>
              <div className="dropdown-menu m-0">
                <Link to="/AddF1History" className="dropdown-item">Add F1 History</Link>
                <Link to="/F1HistoryList" className="dropdown-item">List F1 History</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">{CompanyName}</span>
              <div className="dropdown-menu m-0">
                <Link to="/DeliveryCompanyViewProfile" className="dropdown-item">View Profile</Link>
                <Link to="/" onClick={handleLogout} className="dropdown-item">Logout</Link>
              </div>
            </li>

          </ul>

        </div>
      </nav>
    </>
  );
}

export default DeliveryCompanyNavbar;
