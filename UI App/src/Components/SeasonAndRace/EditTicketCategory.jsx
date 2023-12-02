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

  useEffect(() => {
    const fetchTicketCategoryById = async () => {
      try {
        console.log('Ticket Category ID received through state:', state.categoryId); // Add this line to print categoryId in the console
  
        const response = await axios.get(`https://localhost:7092/api/TicketCategory/GetTicketCategoryById?id=${state.categoryId}`);
        const { ticketCategoryId, categoryName, description, ticketPrice, imageFile, imagePath } = response.data;
  
        setTicketCategory({
          ticketCategoryId,
          categoryName,
          description,
          ticketPrice,
          imageFile: null, // Assuming you don't want to display the image on the form
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

  const handleUpdate = async () => {
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
                onChange={(e) => setTicketCategory({ ...ticketCategory, categoryName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={ticketCategory.description}
                onChange={(e) => setTicketCategory({ ...ticketCategory, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ticket Price"
                fullWidth
                type="text" // Change type to text for displaying as a string
                value={ticketCategory.ticketPrice ? ticketCategory.ticketPrice.toString() : ''} // Convert to string before displaying
                onChange={(e) => setTicketCategory({ ...ticketCategory, ticketPrice: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
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