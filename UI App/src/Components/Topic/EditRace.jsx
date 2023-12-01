import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid, Paper, Typography } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import axios from 'axios';

const EditRace = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [race, setRace] = useState({
    raceId: null,
    raceName: '',
    seasonId: '', // Change type to string
    raceDate: '', // Change date format to dd/mm/yyyy
    raceLocation: '',
    imageFile: null,
  });

  useEffect(() => {
    const fetchRaceById = async () => {
      try {
        const response = await axios.get(`https://localhost:7092/api/Race/GetRaceById?id=${state.raceId}`);
        setRace({
          ...response.data,
          raceDate: new Date(response.data.raceDate).toISOString().split('T')[0], // Format date as yyyy-mm-dd
        });
      } catch (error) {
        console.error('Error fetching race:', error);
      }
    };

    fetchRaceById();
  }, [state.raceId]);

  const handleFileChange = (e) => {
    setRace({ ...race, imageFile: e.target.files[0] });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('raceId', race.raceId);
      formData.append('raceName', race.raceName);
      formData.append('seasonId', race.seasonId);
      formData.append('raceDate', race.raceDate);
      formData.append('raceLocation', race.raceLocation);
      formData.append('imageFile', race.imageFile);

      const response = await axios.put('https://localhost:7092/api/Race/UpdateRace', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Race updated successfully!');
        navigate('/RaceListAdmin');
      } else {
        console.error('Error updating race:', response.status);
      }
    } catch (error) {
      console.error('Error updating race:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Edit Race
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Race Name"
                fullWidth
                value={race.raceName}
                onChange={(e) => setRace({ ...race, raceName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Season ID"
                fullWidth
                value={race.seasonId}
                onChange={(e) => setRace({ ...race, seasonId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Race Date"
                fullWidth
                type="date"
                value={race.raceDate}
                onChange={(e) => setRace({ ...race, raceDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Race Location"
                fullWidth
                value={race.raceLocation}
                onChange={(e) => setRace({ ...race, raceLocation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Race
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

export default EditRace;
