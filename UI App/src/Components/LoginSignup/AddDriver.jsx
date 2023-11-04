import React, { useState } from 'react';
import './AddDriver.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import AdminNavbar from './AdminNavbar';
import { useNavigate } from 'react-router-dom';

const AddDriver = () => {
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

  const validateName = (value) => {
    if (value.length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
      setNameError('Name: Should be at least 3 characters long and contain only alphabets and spaces');
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
      setDobError('Date of Birth: Please enter a valid date that is not a future date.');
      return false;
    } else {
      setDobError('');
      return true;
    }
  };

  const validateDescription = (value) => {
    if (!value.trim() || value.replace(/\s/g, '').length < 10) {
      setDescriptionError('Description: Should be at least 10 characters long (excluding spaces)');
      return false;
    } else {
      setDescriptionError('');
      return true;
    }
  };

  const validateImage = (file) => {
    if (!file || !file.type.match(/image\/(jpeg|jpg|png)/)) {
      setImageFileError('Image File: Only JPEG or PNG files are allowed');
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
    if (validateForm()) {
      setLoading(true);
  
      try {
        const requestBody = {
          name,
          dob,
        };
  
        console.log('Request Body:', JSON.stringify(requestBody));
  
        // Check if the driver is already added
        const checkDriverResponse = await fetch('https://localhost:7092/api/Driver/CheckDriver', {
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
        formData.append('imageFile', imageFile);
  
        const createDriverResponse = await fetch('https://localhost:7092/api/Driver/CreateDriver', {
          method: 'POST',
          body: formData,
        });
  
        if (createDriverResponse.status === 201) {
          toast.success('Driver added successfully');
          navigate('/DriverList');
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
      <AdminNavbar />
      <div className='outerSetup'>
      <br />
      <br />
      
      <div className='add-driver-containertest'>
        <div className='add-driver-panel'>
          <div className='add-driver-header'>
            <div className='add-driver-text'>Add Driver</div>
            <div className='add-driver-underline'></div>
          </div>
          <div className='add-driver-inputs'>
            <div className='add-driver-input'>
              <input
                type='text'
                placeholder='Name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
              />
            </div>
            {nameError && <div className='add-driver-error-box'>{nameError}</div>}
            <div className='add-driver-input'>
              <input
                type='date'
                placeholder='Date of Birth'
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  validateDate(e.target.value);
                }}
              />
            </div>
            {dobError && <div className='add-driver-error-box'>{dobError}</div>}
            <div className='add-driver-input'>
              <input
                type='text' /* Updated to text type */
                placeholder='Description'
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  validateDescription(e.target.value);
                }}
              />
            </div>
            {descriptionError && <div className='add-driver-error-box'>{descriptionError}</div>}
            <div className='add-driver-input'>
              <input
                type='file'
                accept='image/jpeg, image/jpg, image/png'
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  validateImage(e.target.files[0]);
                }}
              />
            </div>
            {imageFileError && <div className='add-driver-error-box'>{imageFileError}</div>}
          </div>
          <div className='add-driver-submit-container'>
            <div className='add-driver-submit' onClick={handleSave} disabled={loading}>
              {loading ? 'Adding...' : 'Add Driver'}
            </div>
          </div>
        </div>
      </div>
      
      <br />
      <br />
      </div>
      <Footer />
    </div>
  );
};

export default AddDriver;
