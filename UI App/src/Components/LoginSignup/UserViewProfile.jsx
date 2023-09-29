/* UserViewProfile.js */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

import './UserViewProfile.css';
import Footer from './Footer';

const UserViewProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if the JWT token is present in local storage
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      // If token is not present, show a toast and redirect to the login page
      toast.error('You are not authorized to access this page');
      navigate('/Signin');
    } else {
      try {
        // Parse the token to get the UserName
        const tokenPayload = jwt_decode(token);
        const userName = tokenPayload.Name;

        // Make a fetch call to retrieve user data
        axios
          .get(`https://localhost:7092/api/User/viewProfile?userName=${userName}`)
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

  const handleEditProfile = () => {
    // Implement the logic to edit the user's profile here
  };

  const renderUserData = () => {
    if (!userData) {
      return <p>Loading user data...</p>;
    }

    const tableData = [
      { label: 'User Name', value: userData.userName },
      { label: 'Email', value: userData.email },
      { label: 'First Name', value: userData.firstName },
      { label: 'Last Name', value: userData.lastName },
    ];

    const tableRows = tableData.map((item) => (
      <tr key={item.label}>
        <td className="attribute">{item.label}</td>
        <td className="data">{item.value}</td>
        <td className="edit">
          <button className="editButton" onClick={handleEditProfile}>
            Edit
          </button>
        </td>
      </tr>
    ));

    return (
      <div>
        <h1 className="headingUserProfile">User Profile</h1>
        <table>
          <tbody>
            {tableRows}
            <tr>
              <td colSpan="3" className="deleteButton">
                <button className="deleteButton" onClick={handleDeleteAccount}>
                  Delete My Account
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <div className="container">{renderUserData()}</div>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default UserViewProfile;
