import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, InputAdornment, Typography, Container } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';


const AddRace = () => {
  const [raceName, setRaceName] = useState('');
  const [seasonYear, setSeasonYear] = useState(''); // Changed to seasonYear
  const [raceDate, setRaceDate] = useState('');
  const [raceLocation, setRaceLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState('');

  const [raceNameError, setRaceNameError] = useState('');
  const [seasonIdError, setSeasonIdError] = useState(''); // Updated error state
  const [raceDateError, setRaceDateError] = useState('');
  const [raceLocationError, setRaceLocationError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

  const navigate = useNavigate();

  const validateRaceName = (value) => {
    const trimmedValue = value.trim(); // Trim white spaces
    if (!trimmedValue || trimmedValue.length < 3 || /\d/.test(trimmedValue)) {
      setRaceNameError('Please enter a valid race name with at least 3 characters and no digits');
      return false;
    } else {
      setRaceNameError('');
      return true;
    }
  };

  const validateSeasonYear = (value) => {
    if (!value || isNaN(value) || value.length !== 4) {
      setSeasonIdError('Please enter a valid 4-digit year');
      return false;
    } else {
      setSeasonIdError('');
      return true;
    }
  };

  const validateRaceDate = (value) => {
    const minYear = 1600;
    const maxYear = 2050;

    if (!value || new Date(value).getFullYear() < minYear || new Date(value).getFullYear() > maxYear) {
      setRaceDateError(`Please enter a valid race date between ${minYear} and ${maxYear}`);
      return false;
    } else {
      setRaceDateError('');
      return true;
    }
  };

  const validateRaceLocation = (value) => {
    const trimmedValue = value.trim(); // Trim white spaces
    if (!trimmedValue || trimmedValue.length < 3) {
      setRaceLocationError('Please enter a valid race location with at least 3 characters');
      return false;
    } else {
      setRaceLocationError('');
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

    isValid = isValid && validateRaceName(raceName);
    isValid = isValid && validateSeasonYear(seasonYear);
    isValid = isValid && validateRaceDate(raceDate);
    isValid = isValid && validateRaceLocation(raceLocation);
    isValid = isValid && validateImage(imageFile);

    return isValid;
  };

  const handleSave = async () => {    
    if (validateForm()) {
      setLoading(true);

      try {
        const seasonIdResponse = await fetch(`${BASE_URL}/api/Season/SeasonIdFromYear?year=${seasonYear}`);
        const seasonIdData = await seasonIdResponse.json();

        if (seasonIdResponse.ok) {
          const formData = new FormData();
          formData.append('raceName', raceName);
          formData.append('seasonId', seasonIdData.seasonId);
          formData.append('raceDate', raceDate);
          formData.append('raceLocation', raceLocation);
          formData.append('imageFile', imageFile);

          console.log('formData:', formData);
          const createRaceResponse = await fetch(`${BASE_URL}/api/Race/CreateRace`, {
            method: 'POST',
            body: formData,
          });

          if (createRaceResponse.status === 201) {
            toast.success('Race added successfully');
            navigate('/RaceListAdmin');
          } else {
            const errorData = await createRaceResponse.json();
            console.error('Race creation failed:', errorData);
            toast.error('Race creation failed');
          }
        } else {
          console.error('Error converting year to SeasonId:', seasonIdData);
          toast.error('Error converting year to SeasonId');
        }
      } catch (error) {
        console.error('Race creation failed:', error);
        toast.error('Race creation failed');
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
      <Container maxWidth="sm" className="outerSetup">
        <br />
        <br />

        <div className="add-race-container">
          <div className="add-race-panel">
            <Typography variant="h5" className="add-race-header">
              Add Race
            </Typography>
            <div className="add-race-inputsadmin">
              <TextField
                label="Race Name"
                variant="outlined"
                fullWidth
                value={raceName}
                onChange={(e) => {
                  setRaceName(e.target.value);
                  validateRaceName(e.target.value);
                }}
                error={Boolean(raceNameError)}
                helperText={raceNameError}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Season Year"
                variant="outlined"
                fullWidth
                type="number"
                value={seasonYear}
                onChange={(e) => {
                  setSeasonYear(e.target.value);
                  validateSeasonYear(e.target.value);
                }}
                error={Boolean(seasonIdError)}
                helperText={seasonIdError}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Race Date"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={raceDate}
                onChange={(e) => {
                  setRaceDate(e.target.value);
                  validateRaceDate(e.target.value);
                  // Restrict the year field to 4 characters
                  setRaceDate(e.target.value.slice(0, 10));
                  validateRaceDate(e.target.value);
                }}
                error={Boolean(raceDateError)}
                helperText={raceDateError}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Race Location"
                variant="outlined"
                fullWidth
                value={raceLocation}
                onChange={(e) => {
                  setRaceLocation(e.target.value);
                  validateRaceLocation(e.target.value);
                }}
                error={Boolean(raceLocationError)}
                helperText={raceLocationError}
                style={{ marginBottom: '10px' }}
              />
              <input
                accept="image/jpeg, image/jpg, image/png"
                style={{ display: 'none' }}
                id="image-file-input-race"
                type="file"
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  validateImage(e.target.files[0]);
                }}
              />
              <label htmlFor="image-file-input-race">
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
            <div className="add-race-submit-container">
              <Button
                variant="contained"
                color="primary"
                className="add-race-submit"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Race'}
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

export default AddRace;
