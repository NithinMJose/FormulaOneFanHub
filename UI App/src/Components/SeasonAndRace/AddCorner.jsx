import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const AddCorner = () => {
  const [cornerNumber, setCornerNumber] = useState('');
  const [cornerCapacity, setCornerCapacity] = useState('');
  const [raceId, setRaceId] = useState('');
  const [loading, setLoading] = useState(false);

  const [cornerNumberError, setCornerNumberError] = useState('');
  const [cornerCapacityError, setCornerCapacityError] = useState('');
  const [raceIdError, setRaceIdError] = useState('');

  const navigate = useNavigate();

  const validateCornerNumber = (value) => {
    if (!/^\d+$/.test(value)) {
      setCornerNumberError('Only digits are allowed');
      return false;
    } else if (value <= 0) {
      setCornerNumberError('Please enter a valid corner number greater than 0');
      return false;
    } else {
      setCornerNumberError('');
      return true;
    }
  };

  const validateCornerCapacity = (value) => {
    const MIN_CAPACITY = 50;
    const MAX_CAPACITY = 500;

    if (!/^\d+$/.test(value)) {
      setCornerCapacityError('Only digits are allowed');
      return false;
    } else if (value < MIN_CAPACITY || value > MAX_CAPACITY) {
      setCornerCapacityError(`Please enter a valid corner capacity between ${MIN_CAPACITY} and ${MAX_CAPACITY}`);
      return false;
    } else {
      setCornerCapacityError('');
      return true;
    }
  };

  const validateRaceId = (value) => {
    if (!/^\d+$/.test(value)) {
      setRaceIdError('Only digits are allowed');
      return false;
    } else if (value <= 0) {
      setRaceIdError('Please enter a valid race ID greater than 0');
      return false;
    } else {
      setRaceIdError('');
      return true;
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const requestBody = {
          cornerNumber: parseInt(cornerNumber),
          cornerCapacity: parseInt(cornerCapacity),
          raceId: parseInt(raceId),
        };

        const createCornerResponse = await fetch(`${BASE_URL}/api/Corner/InsertCorner`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (createCornerResponse.status === 201) {
          toast.success('Corner added successfully');
          navigate('/CornerListAdmin'); // Adjust the route as needed
          // Additional logic or navigation can be added here
        } else {
          const errorData = await createCornerResponse.json();
          console.error('Corner creation failed:', errorData);
          toast.error('Corner creation failed');
        }
      } catch (error) {
        console.error('Corner creation failed:', error);
        toast.error('Corner creation failed');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all required fields and correct validation errors.');
    }
  };

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateCornerNumber(cornerNumber);
    isValid = isValid && validateCornerCapacity(cornerCapacity);
    isValid = isValid && validateRaceId(raceId);

    return isValid;
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

        <div className="add-corner-container">
          <div className="add-corner-panel">
            <Typography variant="h5" className="add-corner-header">
              Add Corner
            </Typography>
            <div className="add-corner-inputsadmin">
              <TextField
                label="Corner Number"
                variant="outlined"
                fullWidth
                type="number"
                value={cornerNumber}
                onChange={(e) => {
                  setCornerNumber(e.target.value);
                  validateCornerNumber(e.target.value);
                }}
                onBlur={() => validateCornerNumber(cornerNumber)}
                error={Boolean(cornerNumberError)}
                helperText={cornerNumberError}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Corner Capacity"
                variant="outlined"
                fullWidth
                type="number"
                value={cornerCapacity}
                onChange={(e) => {
                  setCornerCapacity(e.target.value);
                  validateCornerCapacity(e.target.value);
                }}
                onBlur={() => validateCornerCapacity(cornerCapacity)}
                error={Boolean(cornerCapacityError)}
                helperText={cornerCapacityError}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Race ID"
                variant="outlined"
                fullWidth
                type="number"
                value={raceId}
                onChange={(e) => {
                  setRaceId(e.target.value);
                  validateRaceId(e.target.value);
                }}
                onBlur={() => validateRaceId(raceId)}
                error={Boolean(raceIdError)}
                helperText={raceIdError}
                style={{ marginBottom: '10px' }}
              />
            </div>
            <div className="add-corner-submit-container">
              <Button
                variant="contained"
                color="primary"
                className="add-corner-submit"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Corner'}
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

export default AddCorner;
