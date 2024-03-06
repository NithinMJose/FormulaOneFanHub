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

  const [championError, setChampionError] = useState('');
  const [imageError, setImageError] = useState('');

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

  const validateChampion = (value) => {
    if (value.trim().length < 3) {
      setChampionError('Champion should be at least 3 characters long');
    } else {
      setChampionError('');
    }
  };

  const validateImage = (file) => {
    if (!file) {
      setImageError('Please upload an image file');
      return;
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setImageError('Please upload a valid PNG or JPG image.');
    } else {
      setImageError('');
    }
  };

  const handleUpdate = async () => {
    // Validate champion
    validateChampion(updatedChampion);

    // Validate image
    validateImage(updatedImageFile);

    // If any validation fails, return without updating
    if (championError || imageError) {
      return;
    }

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
      <br />
      <br />
      <br />


      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Edit Season
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Year: {season.year} {/* Display year as text */}
              </Typography>
            </Grid>
            {new Date().getFullYear() > season.year ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Updated Champion"
                    fullWidth
                    value={updatedChampion}
                    onChange={(e) => {
                      setUpdatedChampion(e.target.value);
                      validateChampion(e.target.value);
                    }}
                    error={Boolean(championError)}
                    helperText={championError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setUpdatedImageFile(e.target.files[0]);
                      validateImage(e.target.files[0]);
                    }}
                  />
                  {imageError && (
                    <Typography variant="body2" color="error">
                      {imageError}
                    </Typography>
                  )}
                </Grid>
              </>
            ) : new Date().getFullYear() === season.year ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Updated Champion"
                    fullWidth
                    value={updatedChampion}
                    onChange={(e) => {
                      setUpdatedChampion(e.target.value);
                      validateChampion(e.target.value);
                    }}
                    error={Boolean(championError)}
                    helperText={championError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setUpdatedImageFile(e.target.files[0]);
                      validateImage(e.target.files[0]);
                    }}
                  />
                  {imageError && (
                    <Typography variant="body2" color="error">
                      {imageError}
                    </Typography>
                  )}
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary">
                  No Data Inserted For this Future Season, Updation property will be available later
                </Typography>
              </Grid>
            )}
            {new Date().getFullYear() <= season.year && (
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary">
                  Champion: {season.champion}
                </Typography>
              </Grid>
            )}
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
