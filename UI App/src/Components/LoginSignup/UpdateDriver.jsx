import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdateDriver.css';
import Footer from './Footer';
import {
  Button,
  TextField,
  Typography,
  Container,
} from '@mui/material';

const UpdateDriver = () => {
  const navigate = useNavigate();
  const { driverId } = useParams();
  const [driverData, setDriverData] = useState({
    name: '',
    dob: '',
    description: '',
    imagePath: '',
    imageFile: null,
  });

  const [editableField, setEditableField] = useState('');
  const [nameError, setNameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/Driver/GetDriverById?id=${driverId}`)
      .then((response) => {
        setDriverData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching driver data:', error);
      });
  }, [driverId]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleEditClick = (field) => {
    setEditableField(field);
  };

  const handleFieldChange = (value) => {
    setDriverData((prevData) => ({ ...prevData, [editableField]: value }));
    const isValid = validateField(editableField, value);
  
    // Check if validation is successful and update the corresponding error state
    switch (editableField) {
      case 'name':
        setNameError(isValid ? '' : 'Should be at least 3 characters long and contain only alphabets and spaces');
        break;
      case 'dob':
        validateDate(value); // Call validateDate here
        break;
      case 'description':
        setDescriptionError(isValid ? '' : 'Should be at least 10 characters long (excluding spaces)');
        break;
      default:
        break;
    }
  };
  

  const formatDateToDB = (dateString) => {
    try {
      if (!dateString) {
        return '';
      }
  
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
  
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      
      // If the date is not modified, return the original string without the time part
      if (dateString.includes('T')) {
        return `${year}-${month}-${day}`;
      } else {
        return dateString;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  

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
  
    if (!value || isNaN(selectedDate.getTime()) || value.length !== 10 || value.split('-')[0].length !== 4) {
      setDobError('Please enter a valid date in the format DD-MM-YYYY.');
      return false;
    } else if (selectedDate > currentDate) {
      setDobError('Please enter a date that is not in the future.');
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

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return validateName(value);
      case 'dob':
        return validateDate(value);
      case 'description':
        return validateDescription(value);
      default:
        return true;
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    
    // Check if the file type is either PNG or JPG
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
    // Validate the entire form
    if (!validateForm()) {
      toast.error('Check all input fields and apply again');
      return;
    }
  
    const formData = new FormData();
    formData.append('id', driverId);
    formData.append('name', driverData.name);
  
    // Check if dob has been modified, if not, format it
    if (editableField !== 'dob') {
      const formattedDob = formatDateToDB(driverData.dob);
      console.log('Formatted Date:', formattedDob); // Print the formatted date to the console
      formData.append('dob', formattedDob);
    } else {
      formData.append('dob', driverData.dob);
    }
  
    formData.append('description', driverData.description);
  
    // Print the form data to the console
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
  
    if (driverData.imageFile) {
      formData.append('imageFile', driverData.imageFile);
    }
  
    axios
      .put(`https://localhost:7092/api/Driver/UpdateDriver`, formData)
      .then((response) => {
        console.log('Update successful:', response);
        toast.success('Update successful');
        navigate('/DriverList');
      })
      .catch((error) => {
        console.error('Error updating driver data:', error);
        // Log form data in case of an error during the update
        console.log('Form Data:', formData);
        toast.error('Error updating driver data');
      });
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
      <Container maxWidth="sm" className="updatedriverwrapper">
        <Typography variant="h4" className="headingUpdateDriver">
          Driver Details
        </Typography>
        <div className="fullContainer">
          <table>
            <tbody>
 <tr>
                <td className="attribute">Driver Name</td>
                <td>
                  {editableField === 'name' ? (
                    <TextField
                      type="text"
                      value={driverData.name}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      error={Boolean(nameError)}
                      helperText={nameError}
                    />
                  ) : (
                    <div className="value">{driverData.name}</div>
                  )}
                </td>
                <td>
                  {editableField === 'name' ? (
                    <Button
                      variant="outlined"
                      className="updateButton"
                      onClick={() => setEditableField('')}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className="editButton"
                      onClick={() => handleEditClick('name')}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="attribute">Date of Birth</td>
                <td>
                  {editableField === 'dob' ? (
                    <TextField
                      type="date"
                      value={driverData.dob}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      error={Boolean(dobError)}
                      helperText={dobError}
                    />
                  ) : (
                    <div className="value">{formatDate(driverData.dob)}</div>
                  )}
                </td>
                <td>
                  {editableField === 'dob' ? (
                    <Button
                      variant="outlined"
                      className="updateButton"
                      onClick={() => setEditableField('')}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className="editButton"
                      onClick={() => handleEditClick('dob')}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="attribute">Description</td>
                <td>
                  {editableField === 'description' ? (
                    <TextField
                      type="text"
                      value={driverData.description}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      error={Boolean(descriptionError)}
                      helperText={descriptionError}
                    />
                  ) : (
                    <div className="value">{driverData.description}</div>
                  )}
                </td>
                <td>
                  {editableField === 'description' ? (
                    <Button
                      variant="outlined"
                      className="updateButton"
                      onClick={() => setEditableField('')}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className="editButton"
                      onClick={() => handleEditClick('description')}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="attribute">Existing Image</td>
                <td>
                  {editableField === 'imagePath' ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="inputField"
                    />
                  ) : (
                    <div>
                      {driverData.imageFile ? (
                        <img
                          src={driverData.imagePath}
                          alt={`Image preview`}
                          className="image-preview"
                        />
                      ) : (
                        <img
                          src={`https://localhost:7092/images/${driverData.imagePath}`}
                          alt={`Image for ${driverData.name}`}
                          className="image-preview"
                        />
                      )}
                    </div>
                  )}
                </td>
                <td>
                  {editableField === 'imagePath' ? (
                    <Button
                      variant="outlined"
                      className="updateButton"
                      onClick={() => setEditableField('')}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className="editButton"
                      onClick={() => handleEditClick('imagePath')}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>




            </tbody>
          </table>
        </div>
        <Button variant="contained" color="primary" className="applyButton" onClick={handleUpdateClick}>
          Apply the changes to db
        </Button>
      </Container>
      <Footer />
    </div>
  );
};

export default UpdateDriver;
