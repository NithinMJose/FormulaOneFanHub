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

  const [raceNameError, setRaceNameError] = useState('');
  const [seasonIdError, setSeasonIdError] = useState('');
  const [raceDateError, setRaceDateError] = useState('');
  const [raceLocationError, setRaceLocationError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

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

  const validateField = (field, value) => {
    switch (field) {
      case 'raceName':
        validateRaceName(value);
        break;
      case 'seasonId':
        validateSeasonId(value);
        break;
      case 'raceDate':
        validateRaceDate(value);
        break;
      case 'raceLocation':
        validateRaceLocation(value);
        break;
      default:
        break;
    }
  };

  const validateRaceName = (value) => {
    if (value.trim().length < 3) {
      setRaceNameError('Race Name should be at least 3 characters long');
    } else {
      setRaceNameError('');
    }
  };

  const validateSeasonId = (value) => {
    if (!value || !value.trim) {
      setSeasonIdError('Season ID is required');
    } else {
      setSeasonIdError('');
    }
  };
  

  const validateRaceDate = (value) => {
    if (!value) {
      setRaceDateError('Race Date is required');
    } else {
      setRaceDateError('');
    }
  };

  const validateRaceLocation = (value) => {
    if (value.trim().length < 3) {
      setRaceLocationError('Race Location should be at least 3 characters long');
    } else {
      setRaceLocationError('');
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
    validateField('raceName', race.raceName);
    validateField('seasonId', race.seasonId);
    validateField('raceDate', race.raceDate);
    validateField('raceLocation', race.raceLocation);
    validateImageFile(race.imageFile);

    // If any validation fails, return without updating
    if (raceNameError || seasonIdError || raceDateError || raceLocationError || imageFileError) {
      return;
    }

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
                onChange={(e) => {
                  setRace({ ...race, raceName: e.target.value });
                  validateRaceName(e.target.value);
                }}
                error={Boolean(raceNameError)}
                helperText={raceNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Season ID"
                fullWidth
                value={race.seasonId}
                onChange={(e) => {
                  setRace({ ...race, seasonId: e.target.value });
                  validateSeasonId(e.target.value);
                }}
                error={Boolean(seasonIdError)}
                helperText={seasonIdError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Race Date"
                fullWidth
                type="date"
                value={race.raceDate}
                onChange={(e) => {
                  setRace({ ...race, raceDate: e.target.value });
                  validateRaceDate(e.target.value);
                }}
                error={Boolean(raceDateError)}
                helperText={raceDateError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Race Location"
                fullWidth
                value={race.raceLocation}
                onChange={(e) => {
                  setRace({ ...race, raceLocation: e.target.value });
                  validateRaceLocation(e.target.value);
                }}
                error={Boolean(raceLocationError)}
                helperText={raceLocationError}
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
