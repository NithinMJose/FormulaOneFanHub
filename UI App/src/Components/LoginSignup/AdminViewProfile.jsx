import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
} from '@mui/material';
import AdminNavbar from './AdminNavbar';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Footer from './Footer';

const AdminViewProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    address: '',
  });

  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [addressError, setAddressError] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    clearErrorsOnTyping(name, value);
  };

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

  

  const validatePhoneNumber = (phoneNumber, setError) => {
    const phoneRegex = /^[0-9]+$/;

    if (!phoneRegex.test(phoneNumber) || phoneNumber.length !== 10) {
      setError('Invalid phone number, exactly 10 digits required');
    } else {
      setError('');
    }
};


  const validateAddress = (address, setError) => {
    const minCharacters = 10;
    const trimmedAddress = address.trim(); // Remove leading and trailing whitespaces

    if (!trimmedAddress || trimmedAddress.length < minCharacters) {
      setError(`Address: Minimum ${minCharacters} non-whitespace characters required`);
    } else {
      setError('');
    }
  };

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
      case 'contactNumber':
        setContactNumberError('');
        break;
      case 'address':
        setAddressError('');
        break;
      default:
        break;
    }
  };

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
      case 'contactNumber':
        validatePhoneNumber(value, setContactNumberError);
        break;
      case 'address':
        validateAddress(value, setAddressError);
        break;
      default:
        break;
    }
  };

  const handleDeleteAccount = () => {
    // Implement the logic to delete the user's account here
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleUpdateProfile = () => {
    if (
      !validateEmail(editedData.email) ||
      firstNameError ||
      lastNameError ||
      contactNumberError ||
      addressError
    ) {
      toast.error('Please fix validation errors before updating your profile.');
      return;
    }

    const updatePayload = {
      userName: editedData.userName,
      email: editedData.email,
      firstName: editedData.firstName,
      lastName: editedData.lastName,
      contactNumber: editedData.contactNumber,
      address: editedData.address,
    };

    axios
      .post(`https://localhost:7092/api/User/UpdaterUser`, updatePayload)
      .then((response) => {
        toast.success('Profile updated successfully');
        setIsEditing(false);

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

  const handleChangePassword = () => {
    // Implement the logic to handle changing password
  };

  const renderUserData = () => {
    if (!userData) {
      return <p>Loading user data...</p>;
    }

    const renderField = (label, value) => {
      return isEditing ? (
        <TextField
          fullWidth
          variant="outlined"
          name={label}
          value={editedData[label] || ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          label={label.charAt(0).toUpperCase() + label.slice(1)}
          error={
            (label === 'email' && !!emailError) ||
            !!firstNameError ||
            !!lastNameError ||
            !!contactNumberError ||
            !!addressError
          }
          helperText={
            label === 'email'
              ? emailError
              : label === 'firstName'
              ? firstNameError
              : label === 'lastName'
              ? lastNameError
              : label === 'contactNumber'
              ? contactNumberError
              : addressError
          }
        />
      ) : (
        <Typography variant="body1">{value}</Typography>
      );
    };

    return (
      <div>
        <Typography variant="h4" className="headingUserProfile">
          User Profile
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="attribute">User Name</TableCell>
                <TableCell className="data">{userData.userName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Email</TableCell>
                <TableCell className="data">{userData.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">First Name</TableCell>
                <TableCell className="data">{renderField('firstName', userData.firstName)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Last Name</TableCell>
                <TableCell className="data">{renderField('lastName', userData.lastName)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Contact Number</TableCell>
                <TableCell className="data">{renderField('contactNumber', userData.contactNumber)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Address</TableCell>
                <TableCell className="data">{renderField('address', userData.address)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan="2" className="edit">
                  {isEditing ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        className="updateButton"
                        onClick={handleUpdateProfile}
                      >
                        Update Profile
                      </Button>

                      
                    </>
                  ) : (
                    <>
                      <Button variant="contained" color="primary" className="editButton" onClick={handleEditProfile}>
                        Edit Details
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <div>
      <AdminNavbar />
      <br />
      <br />
      <div className="container">{renderUserData()}</div>
      <br />
      <Footer />
    </div>
  );
};

export default AdminViewProfile;
