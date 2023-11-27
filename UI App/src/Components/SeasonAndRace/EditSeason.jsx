import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { useNavigate } from 'react-router-dom';

const EditSeason = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [season, setSeason] = useState({
    seasonId: null,
    year: 0,
    champion: '',
    imageFile: null,
    imagePath: '',
  });

  const [updatedYear, setUpdatedYear] = useState(0);
  const [updatedChampion, setUpdatedChampion] = useState('');
  const [updatedImageFile, setUpdatedImageFile] = useState(null);

  useEffect(() => {
    const getSeasonById = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Season/GetSeasonById?id=${state.seasonId}`);
        const data = await response.json();
        setSeason(data);

        // Set initial values for input fields
        setUpdatedYear(data.year);
        setUpdatedChampion(data.champion);
      } catch (error) {
        console.error('Error fetching season:', error);
      }
    };

    getSeasonById();
  }, [state.seasonId]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('seasonId', season.seasonId);
    formData.append('year', updatedYear);
    formData.append('champion', updatedChampion);
    formData.append('imageFile', updatedImageFile);

    try {
      const response = await fetch('https://localhost:7092/api/Season/UpdateSeason', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        console.log('Season updated successfully!');
        navigate('/SeasonList');

        // You can redirect or show a success message here
      } else {
        console.error('Error updating season:', response.status);
      }
    } catch (error) {
      console.error('Error updating season:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <br />

      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Edit Season
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Updated Year"
                type="number"
                fullWidth
                value={updatedYear}
                onChange={(e) => setUpdatedYear(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Updated Champion"
                fullWidth
                value={updatedChampion}
                onChange={(e) => setUpdatedChampion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUpdatedImageFile(e.target.files[0])}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Season
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

export default EditSeason;
