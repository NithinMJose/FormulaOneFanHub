// UserViewProfile.js

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
  });

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
        const userName = tokenPayload.userName;

        // Make a fetch call to retrieve user data
        axios
          .get(`https://localhost:7092/api/User/viewProfile?userName=${userName}`)
          .then((response) => {
            setUserData(response.data); // Set user data in state
            setEditedData({ ...response.data }); // Set initial edited data
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
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleUpdateProfile = () => {
    // Create a payload with the updated data
    const updatePayload = {
      userName: editedData.userName,
      email: editedData.email,
      firstName: editedData.firstName,
      lastName: editedData.lastName,
    };
  
    console.log('Updated data:', updatePayload);

    // Implement the logic to update the user's profile here
    axios
      .post(`https://localhost:7092/api/User/UpdaterUser`, updatePayload)
      .then((response) => {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        
        // Refresh user data after updating
        axios
          .get(`https://localhost:7092/api/User/viewProfile?userName=${updatePayload.userName}`)
          .then((response) => {
            setUserData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching updated user data:', error);
            toast.error('An error occurred while fetching updated user data');
          });
      })
      .catch((error) => {
        console.error('Error updating user profile:', error);
        toast.error('An error occurred while updating user profile');
      });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const renderUserData = () => {
    if (!userData) {
      return <p>Loading user data...</p>;
    }

    const renderField = (label, value) => {
      return isEditing ? (
        <input
          type="text"
          name={label}
          value={editedData[label] || ''}
          onChange={handleInputChange}
        />
      ) : (
        <span>{value}</span>
      );
    };

    return (
      <div>
        <h1 className="headingUserProfile">User Profile</h1>
        <table>
          <tbody>
            <tr>
              <td className="attribute">User Name</td>
              <td className="data">{userData.userName}</td>
            </tr>
            <tr>
              <td className="attribute">Email</td>
              <td className="data">{renderField('email', userData.email)}</td>
            </tr>
            <tr>
              <td className="attribute">First Name</td>
              <td className="data">{renderField('firstName', userData.firstName)}</td>
            </tr>
            <tr>
              <td className="attribute">Last Name</td>
              <td className="data">{renderField('lastName', userData.lastName)}</td>
            </tr>
            <tr>
              <td colSpan="2" className="edit">
                {isEditing ? (
                  <button className="updateButton" onClick={handleUpdateProfile}>
                    Update
                  </button>
                ) : (
                  <button className="editButton" onClick={handleEditProfile}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="deleteButton">
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
