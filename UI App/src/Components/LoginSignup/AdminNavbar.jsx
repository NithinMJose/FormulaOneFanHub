import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import './AdminNavbar.css';

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
                <Link to="/AddProductCategory" className="dropdown-item">Add New Category</Link>
                <Link to="/ProductCategoryList" className="dropdown-item">View Category List</Link>
                <Link to="/AddDeliveryCompany" className="dropdown-item">Add New Delivery Company</Link>
                <Link to="/DeliveryCompanyList" className="dropdown-item">View Delivery Companies</Link>
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
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Gallery</span>
              <div className="dropdown-menu m-0">
                <Link to="/AddGallery" className="dropdown-item">Add Gallery Image</Link>
                <Link to="/GalleryListAdmin" className="dropdown-item">GalleryListAdmin</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Team</span>
              <div className="dropdown-menu m-0">
                <Link to="/AddTeam" className="dropdown-item">Add New Team</Link>
                <Link to="/TeamList" className="dropdown-item">List the Teams</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Ticket Booking</span>
              <div className="dropdown-menu m-0">
                <Link to="/AddSeason" className="dropdown-item">Add a new Season</Link>
                <Link to="/SeasonList" className="dropdown-item">List the Season data</Link>
                <Link to="/AddRace" className="dropdown-item">Add a new Race</Link>
                <Link to="/RaceListAdmin" className="dropdown-item">List the Race data</Link>
                <Link to="/AddCorner" className="dropdown-item">Add a new Corner</Link>
                <Link to="/CornerListAdmin" className="dropdown-item">List the Corner data</Link>
                <Link to="/AddTicketCategory" className="dropdown-item">Add a new Ticket Category</Link>
                <Link to="/TicketCategoryList" className="dropdown-item">List the Categories</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Poll</span>
              <div className="dropdown-menu m-0">
                <Link to="/AddPoll" className="dropdown-item">Add new Poll</Link>
                <Link to="/PollList" className="dropdown-item">List All Polls</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Open Forum</span>
              <div className="dropdown-menu m-0">
                <Link to="/AddTopic" className="dropdown-item">Add new Topic</Link>
                <Link to="/TopicListAdmin" className="dropdown-item">List Topic Datas</Link>
                <Link to="/TopicListAdminEditView" className="dropdown-item">Check Comments</Link>
              </div>
            </li>

            <li><Link to="/UserList" className="nav-link">Users</Link></li>
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown">{userName}</span>
              <div className="dropdown-menu m-0">
                <div className='dropdown-item'><Link to="/AdminViewProfile">View Profile</Link></div>
                <div className='dropdown-item' onClick={handleLogout}><Link to="/">Logout</Link></div>
              </div>
            </li>

          </ul>

        </div>
      </nav>
    </>
  );
}

export default AdminNavbar;
