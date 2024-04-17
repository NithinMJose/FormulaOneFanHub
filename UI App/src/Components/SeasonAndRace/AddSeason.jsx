import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  InputAdornment,
  Typography,
  Container,
  Paper,
  Grid,
} from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const AddSeason = () => {
  const [year, setYear] = useState('');
  const [champion, setChampion] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [yearError, setYearError] = useState('');
  const [championError, setChampionError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

  const navigate = useNavigate();

  const validateYear = (value) => {
    const currentYear = new Date().getFullYear();
    const futureLimit = currentYear + 10;

    if (!value || isNaN(value) || value < 1900 || value > futureLimit) {
      setYearError('Please enter a valid year between 1900 and ' + futureLimit);
      setChampion('');
      return false;
    } else {
      setYearError('');
      return true;
    }
  };

  const handleYearChange = (value) => {
    setYear(value);
    validateYear(value);
  };

  const validateChampion = (value) => {
    if (value.length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
      setChampionError('Should be at least 3 characters long and contain only alphabets and spaces');
      return false;
    } else {
      setChampionError('');
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

    isValid = isValid && validateYear(year);

    // Check if the champion field is displayed before validating
    if (year >= 1900 && year <= new Date().getFullYear()) {
      isValid = isValid && validateChampion(champion);
    }

    isValid = isValid && validateImage(imageFile);

    return isValid;
  };

  const handleSave = async () => {
    console.log('Form Data:', {
      year,
      champion: champion || 'NotYetDecided',
      imageFile,
    });
    if (validateForm()) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('year', year);
        formData.append('champion', champion || 'Not_Yet_Decided'); // Set default value if not provided
        formData.append('imageFile', imageFile);

        const createSeasonResponse = await fetch(`${BASE_URL}/api/Season/CreateSeason`, {
          method: 'POST',
          body: formData,
        });

        if (createSeasonResponse.status === 201) {
          toast.success('Season added successfully');
          navigate('/SeasonList');
        } else if (createSeasonResponse.status === 400) {
          const errorData = await createSeasonResponse.json();
          if (errorData.message && errorData.message.includes("Year is already added in the database")) {
            toast.error("Year is already added in the database");
          } else {
            console.error('Season creation failed:', errorData);
            toast.error('Season creation failed, Check if year is already in Database');
          }
        } else {
          const errorData = await createSeasonResponse.json();
          console.error('Season creation failed:', errorData);
          toast.error('Season creation failed, Check if year is already in Database');
        }
      } catch (error) {
        console.error('Season creation failed:', error);
        toast.error('Season creation failed, Check if year is already in Database');
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
      <br />
      <br />
      <br />
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add Season
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Year"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={year}
                  onChange={(e) => handleYearChange(e.target.value)}
                  error={Boolean(yearError)}
                  helperText={yearError}
                />
              </Grid>
              {year >= 1900 && year <= new Date().getFullYear() && (
                <Grid item xs={12}>
                  <TextField
                    label="Champion"
                    variant="outlined"
                    fullWidth
                    value={champion}
                    onChange={(e) => {
                      setChampion(e.target.value);
                      validateChampion(e.target.value);
                    }}
                    error={Boolean(championError)}
                    helperText={championError}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <input
                  accept="image/jpeg, image/jpg, image/png"
                  style={{ display: 'none' }}
                  id="image-file-input-season"
                  type="file"
                  onChange={(e) => {
                    setImageFile(e.target.files[0]);
                    validateImage(e.target.files[0]);
                  }}
                />
                <label htmlFor="image-file-input-season">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    style={{ height: '55px' }}
                    startIcon={<InputAdornment position="start">📷</InputAdornment>}
                  >
                    Upload Image
                  </Button>
                </label>
              </Grid>
              {/* Display image file error message on the next line */}
              <Grid item xs={12}>
                {imageFileError && (
                  <Typography variant="caption" color="error">
                    {imageFileError}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Season'}
            </Button>
          </form>
        </Paper>
      </Container>
      <br />
      <Footer />
    </div>
  );
};

export default AddSeason;
