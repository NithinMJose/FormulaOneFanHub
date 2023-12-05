import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid, Paper, Typography } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import axios from 'axios';

const EditTicketCategory = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [ticketCategory, setTicketCategory] = useState({
    ticketCategoryId: null,
    categoryName: '',
    description: '',
    ticketPrice: null,
    imageFile: null,
  });

  const [categoryNameError, setCategoryNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [ticketPriceError, setTicketPriceError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

  useEffect(() => {
    const fetchTicketCategoryById = async () => {
      try {
        console.log('Ticket Category ID received through state:', state.categoryId);

        const response = await axios.get(`https://localhost:7092/api/TicketCategory/GetTicketCategoryById?id=${state.categoryId}`);
        const { ticketCategoryId, categoryName, description, ticketPrice, imageFile, imagePath } = response.data;

        setTicketCategory({
          ticketCategoryId,
          categoryName,
          description,
          ticketPrice,
          imageFile: null,
        });

        console.log('Data received from the endpoint:', response.data);
      } catch (error) {
        console.error('Error fetching ticket category:', error);
      }
    };

    fetchTicketCategoryById();
  }, [state.ticketCategoryId]);

  const handleFileChange = (e) => {
    setTicketCategory({ ...ticketCategory, imageFile: e.target.files[0] });
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'categoryName':
        validateCategoryName(value);
        break;
      case 'description':
        validateDescription(value);
        break;
      case 'ticketPrice':
        validateTicketPrice(value);
        break;
      default:
        break;
    }
  };

  const validateCategoryName = (value) => {
    if (value.trim().length === 0) {
      setCategoryNameError('Category Name is required');
    } else if (value.trim().length < 3) {
      setCategoryNameError('Category Name should be at least 3 characters long');
    } else {
      setCategoryNameError('');
    }
  };

  const validateDescription = (value) => {
    if (value.trim().length === 0) {
      setDescriptionError('Description is required');
    } else {
      setDescriptionError('');
    }
  };

  const validateTicketPrice = (value) => {
    if (!value || isNaN(value) || parseFloat(value) <= 0) {
      setTicketPriceError('Ticket Price should be a positive number');
    } else {
      setTicketPriceError('');
    }
  };

  const validateImageFile = (file) => {
    if (!file) {
      setImageFileError('Image file is required');
    } else {
      const allowedExtensions = ['png', 'jpg'];
      const extension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        setImageFileError('Invalid file format. Please use PNG or JPG.');
      } else {
        setImageFileError('');
      }
    }
  };

  const handleUpdate = async () => {
    // Validate fields
    validateField('categoryName', ticketCategory.categoryName);
    validateField('description', ticketCategory.description);
    validateField('ticketPrice', ticketCategory.ticketPrice);
    validateImageFile(ticketCategory.imageFile);

    // If any validation fails, return without updating
    if (categoryNameError || descriptionError || ticketPriceError || imageFileError) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ticketCategoryId', ticketCategory.ticketCategoryId);
      formData.append('categoryName', ticketCategory.categoryName);
      formData.append('description', ticketCategory.description);
      formData.append('ticketPrice', ticketCategory.ticketPrice);
      formData.append('imageFile', ticketCategory.imageFile);

      const response = await axios.put('https://localhost:7092/api/TicketCategory/UpdateTicketCategory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Ticket category updated successfully!');
        navigate('/TicketCategoryList');
      } else {
        console.error('Error updating ticket category:', response.status);
      }
    } catch (error) {
      console.error('Error updating ticket category:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Edit Ticket Category
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Category Name"
                fullWidth
                value={ticketCategory.categoryName}
                onChange={(e) => {
                  setTicketCategory({ ...ticketCategory, categoryName: e.target.value });
                  validateCategoryName(e.target.value);
                }}
                error={Boolean(categoryNameError)}
                helperText={categoryNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={ticketCategory.description}
                onChange={(e) => {
                  setTicketCategory({ ...ticketCategory, description: e.target.value });
                  validateDescription(e.target.value);
                }}
                error={Boolean(descriptionError)}
                helperText={descriptionError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ticket Price"
                fullWidth
                type="text"
                value={ticketCategory.ticketPrice ? ticketCategory.ticketPrice.toString() : ''}
                onChange={(e) => {
                  setTicketCategory({ ...ticketCategory, ticketPrice: e.target.value });
                  validateTicketPrice(e.target.value);
                }}
                error={Boolean(ticketPriceError)}
                helperText={ticketPriceError}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileChange(e);
                  validateImageFile(e.target.files[0]);
                }}
              />
              {imageFileError && (
                <Typography variant="body2" color="error">
                  {imageFileError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Ticket Category
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <br />
      <Footer />
    </>
  );
};

export default EditTicketCategory;
