import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import './UserList.css';
import Footer from './Footer';

const UserList = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if the JWT token is present in local storage
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      // If the token is not present, show a toast and redirect to the login page
      toast.error('You are not authorized to access this page');
      navigate('/Signin');
    } else {
      try {
        // Make a fetch call to retrieve user data
        axios
          .get(`https://localhost:7092/api/Admin/ListUsers`)
          .then((response) => {
            setUserData(response.data); // Set user data in state
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            toast.error('An error occurred while fetching user data');
          });
      } catch (error) {
        console.error('Error decoding token:', error);
        toast.error('An error occurred while decoding the token');
        navigate('/Signin');
      }
    }
  }, [navigate]);

  const handleDeleteAccount = () => {
    // Implement the logic to delete the user's account here
    // You can show a confirmation dialog before performing the deletion
  };

  const handleManage = () => {
    // Implement the logic to manage the user here
  };

  const renderUserData = () => {
    if (!userData) {
      return <p>Loading user data...</p>;
    }

    // Create a table to display user data
    return (
      <div className="user-container">
        <div className="user-content">
          <h1 className="user-heading">Users List</h1>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Created On</th>
                  <th>Created By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user, index) => (
                  <tr key={index}>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.createdOn}</td>
                    <td>{user.createdBy}</td>
                    <td>
                      <button className="btn btn-primary" onClick={handleManage}>
                        Manage
                      </button>
                      <button className="btn btn-danger" onClick={handleDeleteAccount}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      {renderUserData()}
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default UserList;
