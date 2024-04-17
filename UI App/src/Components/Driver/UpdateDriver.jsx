import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdateDriver.css';
import Footer from '../LoginSignup/Footer';
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../../config';

const UpdateDriver = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const driverId = state.driverId;

  const [driverData, setDriverData] = useState({
    name: '',
    dob: '',
    description: '',
    imagePath: '',
    imageFile: null,
  });

  const [nameError, setNameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Driver/GetDriverById?id=${driverId}`)
      .then((response) => {
        const formattedDate = response.data.dob
          ? new Date(response.data.dob).toISOString().split('T')[0]
          : '';

        setDriverData({
          ...response.data,
          dob: formattedDate,
        });
      })
      .catch((error) => {
        console.error('Error fetching driver data:', error);
      });
  }, [driverId]);

  const handleFieldChange = (field, value) => {
    setDriverData((prevData) => ({ ...prevData, [field]: value }));
    validateField(field, value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file || (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
      toast.error('Please upload a valid PNG or JPG image.');
      return;
    }

    setDriverData((prevData) => ({
      ...prevData,
      imageFile: file,
      imagePath: URL.createObjectURL(file),
    }));
  };

  const handleUpdateClick = () => {
    if (!validateForm()) {
      toast.error('Check all input fields and apply again');
      return;
    }

    const formData = new FormData();
    formData.append('id', driverId);
    formData.append('name', driverData.name);
    formData.append('dob', driverData.dob);
    formData.append('description', driverData.description);

    if (driverData.imageFile) {
      formData.append('imageFile', driverData.imageFile);
    }

    // Log the formData object just before sending
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    axios
      .put(`${BASE_URL}/api/Driver/UpdateDriver`, formData)
      .then((response) => {
        console.log('Update successful:', response);
        toast.success('Update successful');
        navigate('/DriverList');
      })
      .catch((error) => {
        console.error('Error updating driver data:', error);
        console.log('Form Data:', formData);
        toast.error('Error updating driver data');
      });
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        validateName(value);
        break;
      case 'dob':
        validateDate(value);
        break;
      case 'description':
        validateDescription(value);
        break;
      default:
        break;
    }
  };

  const validateDate = (value) => {
    const currentDate = new Date();
    const selectedDate = new Date(value);

    if (selectedDate > currentDate) {
      setDobError('Date of Birth cannot be in the future');
      return false;
    } else {
      setDobError('');
      return true;
    }
  };

  const validateName = (value) => {
    if (value.trim().length < 3) {
      setNameError('Driver name should be at least 3 characters long');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateDescription = (value) => {
    if (value.trim().length < 10) {
      setDescriptionError('Description should be at least 10 characters long');
      return false;
    } else {
      setDescriptionError('');
      return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateName(driverData.name);
    isValid = isValid && validateDate(driverData.dob);
    isValid = isValid && validateDescription(driverData.description);

    return isValid;
  };

  return (
    <div>
      <AdminNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Driver Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Driver Name"
                fullWidth
                value={driverData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={Boolean(nameError)}
                helperText={nameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                value={driverData.dob}
                onChange={(e) => handleFieldChange('dob', e.target.value)}
                error={Boolean(dobError)}
                helperText={dobError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                value={driverData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                error={Boolean(descriptionError)}
                helperText={descriptionError}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            onClick={handleUpdateClick}
          >
            Apply the changes to db
          </Button>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default UpdateDriver;
