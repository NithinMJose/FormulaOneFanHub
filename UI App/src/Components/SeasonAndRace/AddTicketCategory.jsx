// AddTicketCategory.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, InputAdornment } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const AddTicketCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [categoryNameError, setCategoryNameError] = useState('');
  const [ticketPriceError, setTicketPriceError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

  const navigate = useNavigate();

  const validateCategoryName = (value) => {
    if (!value || value.length < 3) {
      setCategoryNameError('Please enter a valid category name with at least 3 characters');
      return false;
    } else {
      setCategoryNameError('');
      return true;
    }
  };

  const validateTicketPrice = (value) => {
    if (!value || isNaN(value) || value <= 0) {
      setTicketPriceError('Please enter a valid ticket price greater than 0');
      return false;
    } else {
      setTicketPriceError('');
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

    isValid = isValid && validateCategoryName(categoryName);
    isValid = isValid && validateTicketPrice(ticketPrice);
    isValid = isValid && validateImage(imageFile);

    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('categoryName', categoryName);
        formData.append('description', description);
        formData.append('ticketPrice', ticketPrice);
        formData.append('imageFile', imageFile);

        const createTicketCategoryResponse = await fetch(`${BASE_URL}/api/TicketCategory/InsertTicketCategory`, {
          method: 'POST',
          body: formData,
        });

        if (createTicketCategoryResponse.status === 201) {
          toast.success('Ticket Category added successfully');
          navigate('/TicketCategoryList'); // Adjust the route as needed
          // Additional logic or navigation can be added here
        } else {
          const errorData = await createTicketCategoryResponse.json();
          console.error('Ticket Category creation failed:', errorData);
          toast.error('Ticket Category creation failed');
        }
      } catch (error) {
        console.error('Ticket Category creation failed:', error);
        toast.error('Ticket Category creation failed');
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
      <br />
      <Container maxWidth="sm" className="outerSetup">
        <br />
        

        <div className="add-corner-container">
          <div className="add-corner-panel">
            <Typography variant="h5" className="add-corner-header">
              Add Ticket Category
            </Typography>
            <div className="add-corner-inputsadmin">
              <TextField
                label="Category Name"
                variant="outlined"
                fullWidth
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  validateCategoryName(e.target.value);
                }}
                error={Boolean(categoryNameError)}
                helperText={categoryNameError}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Ticket Price"
                variant="outlined"
                fullWidth
                type="number"
                value={ticketPrice}
                onChange={(e) => {
                  setTicketPrice(e.target.value);
                  validateTicketPrice(e.target.value);
                }}
                error={Boolean(ticketPriceError)}
                helperText={ticketPriceError}
                style={{ marginBottom: '10px' }}
              />
              <input
                accept="image/jpeg, image/jpg, image/png"
                style={{ display: 'none' }}
                id="image-file-input-category"
                type="file"
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  validateImage(e.target.files[0]);
                }}
              />
              <label htmlFor="image-file-input-category">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  style={{ height: '55px', marginBottom: '10px' }}
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
            <div className="add-corner-submit-container">
              <Button
                variant="contained"
                color="primary"
                className="add-corner-submit"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Ticket Category'}
              </Button>
            </div>
          </div>
        </div>

        <br />
        <br />
      </Container>
      <br />
      <Footer />
    </div>
  );
};

export default AddTicketCategory;
