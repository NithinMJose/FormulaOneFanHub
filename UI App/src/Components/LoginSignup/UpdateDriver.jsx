import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateDriver = () => {
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
  const [ageError, setAgeError] = useState('');
  const [yearError, setYearError] = useState('');
  const [imageFormatError, setImageFormatError] = useState('');

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

  const handleFieldChange = (value, field) => {
    setDriverData((prevData) => ({ ...prevData, [field]: value }));
    // Show error box whenever there is a change in the name field
    if (field === 'name') {
      validateName(value);
    }
    // Show age validation error dynamically as DOB is typed
    if (field === 'dob') {
      validateAge(value);
      validateYear(value);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    // Validate image format
    if (!validateImageFormat(file)) {
      return;
    }

    // Create a temporary URL for the selected image file
    const imageURL = URL.createObjectURL(file);

    setDriverData((prevData) => ({ ...prevData, imageFile: file, imagePath: imageURL }));
  };

  const validateImageFormat = (file) => {
    const allowedFormats = ['image/jpeg', 'image/png'];

    if (file && allowedFormats.includes(file.type)) {
      setImageFormatError('');
      return true;
    } else {
      setImageFormatError('Image format must be jpg or png');
      return false;
    }
  };

  const validateName = (value) => {
    if (value.length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
      setNameError('Name: Should be at least 3 characters long and contain only alphabets and spaces');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateAge = (dob) => {
    // Calculate and update the age validation error dynamically
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();

    if (age < 15) {
      setAgeError('Driver age should be above 15');
      return false;
    } else {
      setAgeError('');
      return true;
    }
  };

  const validateYear = (dob) => {
    // Validate if the year contains more than 4 digits
    const yearRegex = /^\d{1,4}$/;
    const year = dob.split('-')[0];

    if (!yearRegex.test(year)) {
      setYearError('Year should not contain more than 4 digits');
      return false;
    } else if (parseInt(year) < 1000) {
      setYearError('Please check the Date of Birth');
      return false;
    } else {
      setYearError('');
      return true;
    }
  };

  const handleUpdateClick = () => {
    if (
      validateName(driverData.name) &&
      validateAge(driverData.dob) &&
      validateYear(driverData.dob) &&
      validateImageFormat(driverData.imageFile)
    ) {
      const formData = new FormData();

      formData.append('id', driverId);
      formData.append('name', driverData.name);
      formData.append('dob', driverData.dob);
      formData.append('description', driverData.description);

      if (driverData.imageFile) {
        formData.append('imageFile', driverData.imageFile);
      }

      axios
        .put(`https://localhost:7092/api/Driver/UpdateDriver`, formData)
        .then((response) => {
          console.log('Update successful:', response);
          toast.success('Update successful');
        })
        .catch((error) => {
          console.error('Error updating driver data:', error);
          toast.error('Error updating driver data');
        });
    } else {
      toast.error('Please fill in all required fields and correct validation errors.');
    }
  };

  return (
    <div>
      <AdminNavbar />

      <h1 style={{ paddingTop: '10px' }}>Driver Details</h1>
      <div className="updatedFullContainer">
        <table>
          <tbody>
            <tr>
              <td>Driver Name</td>
              <td>
                {editableField === 'name' ? (
                  <>
                    <input
                      type="text"
                      value={driverData.name}
                      onChange={(e) => handleFieldChange(e.target.value, 'name')}
                    />
                    {nameError && <div className='error-box'>{nameError}</div>}
                  </>
                ) : (
                  driverData.name
                )}
              </td>
              <td>
                {editableField === 'name' && (
                  <button onClick={() => setEditableField('')}>Update</button>
                )}
                {editableField !== 'name' && (
                  <button onClick={() => handleEditClick('name')}>Edit</button>
                )}
              </td>
            </tr>
            <tr>
              <td>Date of Birth</td>
              <td>
                {editableField === 'dob' ? (
                  <>
                    <input
                      type="date"
                      value={driverData.dob}
                      onChange={(e) => handleFieldChange(e.target.value, 'dob')}
                    />
                    {ageError && <div className='error-box'>{ageError}</div>}
                    {yearError && <div className='error-box'>{yearError}</div>}
                  </>
                ) : (
                  formatDate(driverData.dob)
                )}
              </td>
              <td>
                {editableField === 'dob' && (
                  <button onClick={() => setEditableField('')}>Update</button>
                )}
                {editableField !== 'dob' && (
                  <button onClick={() => handleEditClick('dob')}>Edit</button>
                )}
              </td>
            </tr>
            <tr>
              <td>Description</td>
              <td>
                {editableField === 'description' ? (
                  <textarea
                    value={driverData.description}
                    onChange={(e) => handleFieldChange(e.target.value, 'description')}
                    style={{ width: '90%', minHeight: '150px', maxHeight: '400px' }}
                  />
                ) : (
                  driverData.description
                )}
              </td>
              <td>
                {editableField === 'description' && (
                  <button onClick={() => setEditableField('')}>Update</button>
                )}
                {editableField !== 'description' && (
                  <button onClick={() => handleEditClick('description')}>Edit</button>
                )}
              </td>
            </tr>
            <tr>
              <td>Existing Image</td>
              <td>
                {editableField === 'imagePath' ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {driverData.imagePath ? (
                      <span>New Image</span>
                    ) : (
                      <img
                        src={driverData.imagePath}
                        alt={`Image for ${driverData.name}`}
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                      />
                    )}
                    {imageFormatError && <div className='error-box'>{imageFormatError}</div>}
                  </>
                ) : (
                  driverData.imagePath && (
                    <img
                      src={`https://localhost:7092/images/${driverData.imagePath}`}
                      alt={`Image for ${driverData.name}`}
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  )
                )}
              </td>
              <td>
                {editableField === 'imagePath' && (
                  <button onClick={() => setEditableField('')}>Update</button>
                )}
                {editableField !== 'imagePath' && (
                  <button onClick={() => handleEditClick('imagePath')}>Edit</button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="applyChangesButton" onClick={handleUpdateClick}>
        Apply the changes to db
      </button>
    </div>
  );
};

export default UpdateDriver;