// Import necessary dependencies and components
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import './UserViewProfile.css';
import Footer from './Footer';

const UserViewProfile = () => {
  // State variables
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  // Validation errors state
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  // UseEffect hook
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      toast.error('You are not authorized to access this page');
      navigate('/Signin');
    } else {
      try {
        const tokenPayload = jwt_decode(token);
        const userName = tokenPayload.userName;

        axios
          .get(`https://localhost:7092/api/User/viewProfile?userName=${userName}`)
          .then((response) => {
            setUserData(response.data);
            setEditedData({ ...response.data });
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear validation errors on typing
    clearErrorsOnTyping(name, value);
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validateName = (name, setError) => {
    const nameRegex = /^[A-Za-z]+$/;
    const minLength = name.length >= 4;

    if (!nameRegex.test(name) && !minLength) {
      setError('Only alphabets, minimum 4 characters');
    } else if (!nameRegex.test(name)) {
      setError('Only alphabets are allowed');
    } else if (!minLength) {
      setError('Minimum 4 characters required');
    } else {
      setError('');
    }
  };

  // Clear validation errors on typing
  const clearErrorsOnTyping = (name, value) => {
    switch (name) {
      case 'email':
        setEmailError('');
        break;
      case 'firstName':
        setFirstNameError('');
        break;
      case 'lastName':
        setLastNameError('');
        break;
      default:
        break;
    }
  };

  // Handle validation on blur
  const handleInputBlur = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          setEmailError('Not a valid email format');
        }
        break;
      case 'firstName':
        validateName(value, setFirstNameError);
        break;
      case 'lastName':
        validateName(value, setLastNameError);
        break;
      default:
        break;
    }
  };

  // Handle delete account function
  const handleDeleteAccount = () => {
    // Implement the logic to delete the user's account here
  };

  // Handle edit profile function
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Handle update profile function
  const handleUpdateProfile = () => {
    // Validate data before sending to the backend
    if (!validateEmail(editedData.email) || firstNameError || lastNameError) {
      toast.error('Please fix validation errors before updating your profile.');
      return;
    }

    // Create a payload with the updated data
    const updatePayload = {
      userName: editedData.userName,
      email: editedData.email,
      firstName: editedData.firstName,
      lastName: editedData.lastName,
    };

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

  // Handle change password function
  const handleChangePassword = () => {
    // Implement the logic to handle changing password
  };

  // Render user data function
  const renderUserData = () => {
    if (!userData) {
      return <p>Loading user data...</p>;
    }

    const renderField = (label, value) => {
      return isEditing ? (
        <div>
          <input
            type="text"
            name={label}
            value={editedData[label] || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
          {label === 'email' && emailError && <div className="validation-error">{emailError}</div>}
          {label === 'firstName' && firstNameError && (
            <div className="validation-error">{firstNameError}</div>
          )}
          {label === 'lastName' && lastNameError && <div className="validation-error">{lastNameError}</div>}
        </div>
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
              <td className="data">{userData.email}</td>
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
                  <>
                    <button className="updateButton" onClick={handleUpdateProfile}>
                      Update Profile
                    </button>
                    <button className="changePasswordButton" onClick={handleChangePassword}>
                      Change Password
                    </button>
                  </>
                ) : (
                  <>
                    <button className="editButton" onClick={handleEditProfile}>
                      Edit Details
                    </button>
                  </>
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

  // Return JSX
  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <div className="container">{renderUserData()}</div>
      <br />
      <Footer />
    </div>
  );
};

export default UserViewProfile;
