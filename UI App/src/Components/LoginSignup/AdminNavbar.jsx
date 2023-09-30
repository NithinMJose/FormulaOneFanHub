import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCut } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import '../LoginSignup/AdminNavbar.css';
import { toast } from 'react-toastify';
import './UserList' 

function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    toast.success('Logged out successfully');
    navigate('/Signin');
  };

  return (
    <div>
  <AdminNavbar />
    <nav className="navbar">
      <div className="navbar-brand">
        <FontAwesomeIcon icon={faCut} />
        <h1>Formula1 FanHub</h1>
      </div>
      <button className={`navbar-toggle ${isOpen ? 'open' : ''}`} onClick={toggleNavbar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <h2 className="UserNavHome"><Link to="/">Home</Link></h2>
        <h2 className='UserNavAbout full-height-background'><Link to="/about">About</Link></h2>
        <h2 className='UserNavServices full-height-background'><Link to="/service">Service</Link></h2>
        <h2 className='UserNavPages full-height-background'><Link to="/pages">Pages</Link></h2>
        <h2 className='UserNavProfile full-height-background'><Link to="/UserList">Users</Link></h2>
        <h2 className="UserNavLogout" onClick={handleLogout}><Link to="/">Logout</Link></h2>
      </div>
    </nav>
    </div>
  );
}

export default AdminNavbar;
