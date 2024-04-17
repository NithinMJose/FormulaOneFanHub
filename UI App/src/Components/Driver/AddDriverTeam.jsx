import React, { useState } from 'react';
import './AddDriverTeam.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, InputAdornment, Typography, Container, Grid } from '@mui/material';
import TeamSidebar from '../sidebar/TeamSidebar'; // Import the AdminSidebar component
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';
import { BASE_URL } from '../../config';


const AddDriverTeam = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');


  const validateName = (value) => {
    if (value.length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
      setNameError('Should be at least 3 characters long and contain only alphabets and spaces');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateDate = (value) => {
    const currentDate = new Date();
    const selectedDate = new Date(value);
  
    if (
      !value ||
      isNaN(selectedDate.getTime()) ||
      value.length !== 10 ||
      selectedDate > currentDate ||
      value.split('-')[0].length !== 4
    ) {
      setDobError('Please enter a valid date that is not a future date.');
      return false;
    } else {
      const age = currentDate.getFullYear() - selectedDate.getFullYear();
      if (age < 15) {
        setDobError('Driver must be at least 15 years old.');
        return false;
      }
  
      // Check if the year is after 1700
      if (selectedDate.getFullYear() < 1700) {
        setDobError('Year value must be after 1700.');
        return false;
      }
  
      setDobError('');
      return true;
    }
  };
  
  const validateDescription = (value) => {
    if (!value.trim() || value.replace(/\s/g, '').length < 10) {
      setDescriptionError('Should be at least 10 characters long (excluding spaces)');
      return false;
    } else {
      setDescriptionError('');
      return true;
    }
  };

  const validateImage = (file) => {
    if (!file || !file.type.match(/image\/(jpeg|jpg|png)/)) {
      setImageFileError('Only JPEG or PNG files are allowed');
      return false;
    } else {
      setImageFileError('');
      return true;
    }     
  };

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateName(name);
    isValid = isValid && validateDate(dob);
    isValid = isValid && validateDescription(description);
    isValid = isValid && validateImage(imageFile);

    return isValid;
  };

  const handleSave = async () => {
    const decodedToken = jwt_decode(token);
    console.log('decoded token :', decodedToken);
    const numericUserId = parseInt(decodedToken.teamId);
    console.log('teamId :', numericUserId);
    if (validateForm()) {
      setLoading(true);

      try {
        const requestBody = {
          name,
          dob,
        };

        console.log('Request Body:', JSON.stringify(requestBody));

        // Check if the driver is already added
        const checkDriverResponse = await fetch(`${BASE_URL}/api/Driver/CheckDriver`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const { isDriverExists } = await checkDriverResponse.json();

        if (isDriverExists) {
          toast.error('Driver is already added in the database');
          setLoading(false);
          return;
        }

        // If the driver is not already added, proceed with adding the driver
        const formData = new FormData();
        formData.append('name', name);
        formData.append('dob', dob);
        formData.append('description', description);
        formData.append('teamIdRef', numericUserId);
        formData.append('imageFile', imageFile);

        const createDriverResponse = await fetch(`${BASE_URL}/api/Driver/CreateDriver`, {
          method: 'POST',
          body: formData,
        });

        if (createDriverResponse.status === 201) {
          toast.success('Driver added successfully');
          navigate('/DriverListTeam');
          // Additional logic or navigation can be added here
        } else {
          const errorData = await createDriverResponse.json();
          console.error('Driver creation failed:', errorData);
          toast.error('Driver creation failed');
        }
      } catch (error) {
        console.error('Driver creation failed:', error);
        toast.error('Driver creation failed');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all required fields and correct validation errors.');
    }
  };

  return (
    <div>
      <TeamNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="container-fluid">
        <div className="row">
          <TeamSidebar /> {/* Display the TeamSidebar component as a sidebar */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Container maxWidth="sm" className="outerSetup">
              <br />
              <br />
  
              <div className="add-driver-container">
                <div className="add-driver-panel">
                  <Typography variant="h5" className="add-driver-header">
                    Add Driver
                  </Typography>
                  <div className="add-driver-inputsadmin">
                    <TextField
                      label="Name"
                      variant="outlined"
                      fullWidth
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        validateName(e.target.value);
                      }}
                      error={Boolean(nameError)}
                      helperText={nameError}
                    />
                    <TextField
                      label="Date of Birth"
                      type="date"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={dob}
                      max={(new Date()).toISOString().split("T")[0]}
                      onChange={(e) => {
                        setDob(e.target.value);
                        validateDate(e.target.value);
                      }}
                      error={Boolean(dobError)}
                      helperText={dobError}
                    />
                    <TextField
                      label="Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        validateDescription(e.target.value);
                      }}
                      error={Boolean(descriptionError)}
                      helperText={descriptionError}
                    />
                    <input
                      accept="image/jpeg, image/jpg, image/png"
                      style={{ display: 'none' }}
                      id="image-file-input"
                      type="file"
                      onChange={(e) => {
                        setImageFile(e.target.files[0]);
                        validateImage(e.target.files[0]);
                      }}
                    />
                    <label htmlFor="image-file-input">
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        style={{ height: '55px' }}
                        startIcon={<InputAdornment position="start">📷</InputAdornment>}
                      >
                        Upload Image
                      </Button>
                    </label>
                    {imageFileError && (
                      <Typography variant="caption" color="error">
                        {imageFileError}
                      </Typography>
                    )}
                  </div>
                  <div className="add-driver-submit-container">
                    <Button
                      variant="contained"
                      color="primary"
                      className="add-driver-submit"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Driver'}
                    </Button>
                  </div>
                </div>
              </div>
  
              <br />
              <br />
            </Container>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
  
};

export default AddDriverTeam;