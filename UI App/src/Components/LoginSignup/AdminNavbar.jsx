// HomeNavbar.js

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

import './HomeNavbar.css';

function AdminNavbar() {
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
            <a href="/AboutPage" className="nav-item nav-link active">
              About
            </a>


          <div className="nav-item dropdown">
            <a href="#" className="nav-item nav-link active" data-bs-toggle="dropdown">
            Driver
            </a>
            <div className="dropdown-menu m-0">
              <Link to="/AddDriver" className="dropdown-item">
                Add New Driver
              </Link>
              <Link to="/DriverList" className="dropdown-item">
                View Driver List
              </Link>              
            </div>
          </div>

          <div className="nav-item dropdown">
            <a href="#" className="nav-item nav-link active" data-bs-toggle="dropdown">
            History
            </a>
            <div className="dropdown-menu m-0">
              <Link to="/AddF1History" className="dropdown-item">
                Add F1 History
              </Link>
              <Link to="/F1HistoryList" className="dropdown-item">
                List F1 History
              </Link>   
              <Link to="/AddTeamHistory" className="dropdown-item">
                Add Team History
              </Link>
              <Link to="/TeamHistoryList" className="dropdown-item">
                List Team History
              </Link>            
            </div>
          </div>


          <div className="nav-item dropdown">
            <a href="#" className="nav-item nav-link active" data-bs-toggle="dropdown">
            Ticket Booking
            </a>
            <div className="dropdown-menu m-0">
              <Link to="/AddSeason" className="dropdown-item">
              Add a new Season
              </Link>
              <Link to="/SeasonList" className="dropdown-item">
              List the Season data
              </Link>
              <Link to="/AddRace" className="dropdown-item">
              Add a new Race
              </Link>
              <Link to="/RaceListAdmin" className="dropdown-item">
              List the Race data
              </Link>   
              <Link to="/AddCorner" className="dropdown-item">
              Add a new Corner
              </Link>
              <Link to="/CornerListAdmin" className="dropdown-item">
              List the Corner data
              </Link>
              <Link to="/AddTicketCategory" className="dropdown-item">
              Add a new Ticket Category
              </Link>
              <Link to="/TicketCategoryList" className="dropdown-item">
              List the Categories
              </Link>                        
            </div>
          </div>


          <div className="nav-item dropdown">
            <a href="#" className="nav-item nav-link active" data-bs-toggle="dropdown">
            Poll
            </a>
            <div className="dropdown-menu m-0">
              <Link to="/AddPoll" className="dropdown-item">
                Add new Poll
              </Link>
              <Link to="/PollList" className="dropdown-item">
                List All Polls
              </Link>               
            </div>
          </div>

          <div className="nav-item dropdown">
            <a href="#" className="nav-item nav-link active" data-bs-toggle="dropdown">
            Open Forum
            </a>
            <div className="dropdown-menu m-0">
              <Link to="/AddTopic" className="dropdown-item">
                Add new Topic
              </Link>
              <Link to="/TopicListAdmin" className="dropdown-item">
                List Topic Datas
              </Link>  
              <Link to="/TopicListAdminEditView" className="dropdown-item">
                Check Comments
              </Link>             
            </div>
          </div>


          <Link to="/UserList" className="nav-item nav-link active">
            Users
          </Link>

          </div>
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              {userName}
            </a>
            <div className="dropdown-menu m-0">
              <div className='dropdown-item'><Link to="/AdminViewProfile">View Profile</Link></div>
              <div className='dropdown-item' onClick={handleLogout}><Link to="/">Logout</Link></div>
            </div>
          </div>
        </div>
      </nav>
      {/* Navbar End */}
    </>
  );
}

export default AdminNavbar;
