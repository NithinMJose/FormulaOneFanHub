import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import axios from 'axios'; // Import Axios for making HTTP requests
import './TeamNavbar.css';

function TeamNavbar() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('Login and then access the Home page');
      navigate('/Signin');
    } else {
      const tokenPayload = jwt_decode(token);
      const decodedUserName = tokenPayload.userName;
      setUserName(decodedUserName); // Set the username state
      fetchTeamStatus(decodedUserName); // Fetch team status when component mounts
    }
  }, [navigate]);

  const fetchTeamStatus = async (userName) => {
    try {
      const response = await fetch(`https://localhost:7092/api/Team/GetIdByUserName?userName=${userName}`);
      const data = await response.json();
      console.log("User Id:", data.teamId);
      try {
        const response2 = await fetch(`https://localhost:7092/api/Team/GetTeamById?id=${data.teamId}`);
        const data2 = await response2.json();
        console.log("User Status:", data2.status);
        setStatus(data2.status);
      } catch (error) {
        console.error("Error fetching team status:", error);
      }
    } catch (error) {
      console.error("Error fetching team status:", error);
    }
  };

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
            {/* Conditionally render the "Update the Profile ASAP" link */}
            {status === 'inactive' && (
              <li className="nav-item">
                <Link to="/TeamViewProfile" className="UpdateMsg">Update the Profile ASAP</Link>
              </li>
            )}
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">{userName}</span>
              <div className="dropdown-menu m-0">
                <div ><Link to="/TeamViewProfile" className='dropdown-item' >View Profile</Link></div>
                <div  ><Link to="/" className='dropdown-item' onClick={handleLogout} >Logout</Link></div>
              </div>
            </li>

          </ul>
        </div>
      </nav>
    </>
  );
}

export default TeamNavbar;
