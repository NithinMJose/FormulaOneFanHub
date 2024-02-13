import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { useLocation } from 'react-router-dom';


const validateForm = () => {
    let isValid = true;
  
    return isValid;
  };
  

const UpdateTeam = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const teamId = state.teamId;

  const [teamData, setTeamData] = useState({
    name: '',
    country: '',
    teamPrincipal: '',
    technicalChief: '',
    engineSupplier: '',
    chassis: '',
    status: '',
    imagePath: '',
    imageFile: null,
  });

  const [nameError, setNameError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [teamPrincipalError, setPrincipalError] = useState('');
  const [technicalChiefError, setChiefError] = useState('');
  const [engineSupplierError, setSupplierError] = useState('');
  const [chassisError, setChassisError] = useState('');
  const [statusError, setStatusError] = useState('');



  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/Team/GetTeamById?id=${teamId}`)
      .then((response) => {
        setTeamData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching team data:', error);
      });
  }, [teamId]);

  const handleFieldChange = (field, value) => {
    setTeamData((prevData) => ({ ...prevData, [field]: value }));
    if (field === 'name') {
        if (value.trim().length < 3) {
          setNameError('Name must be at least 3 characters long');
        } else {
          setNameError('');
        }
      }
        if (field === 'country') {
            if (value.trim().length < 3) {
            setCountryError('Country must be at least 3 characters long');
            } else {
            setCountryError('');
            }
        }
        if (field === 'teamPrincipal') {
            if (value.trim().length < 3) {
            setPrincipalError('Team Principal must be at least 3 characters long');
            } else {
            setPrincipalError('');
            }
        }
        if (field === 'technicalChief') {
            if (value.trim().length < 3) {
            setChiefError('Technical Chief must be at least 3 characters long');
            } else {
            setChiefError('');
            }
        }
        if (field === 'engineSupplier') {
            if (value.trim().length < 3) {
            setSupplierError('Engine Supplier must be at least 3 characters long');
            } else {
            setSupplierError('');
            }
        }
        if (field === 'chassis') {
            if (value.trim().length < 3) {
            setChassisError('Chassis must be at least 3 characters long');
            } else {
            setChassisError('');
            }
        }
        if (field === 'status') {
            if (value.trim().length < 3) {
            setStatusError('Status must be at least 3 characters long');
            } else {
            setStatusError('');
            }
        }


  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file || (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
      toast.error('Please upload a valid PNG or JPG image.');
      return;
    }

    setTeamData((prevData) => ({
      ...prevData,
      imageFile: file,
      imagePath: URL.createObjectURL(file),
    }));
  };

  const handleUpdateClick = () => {
    if (!validateForm()) {
      toast.error('Check all input fields and apply again');
      return;
    }
  
    const formData = new FormData();
    formData.append('id', teamId);
    formData.append('name', teamData.name);
    formData.append('country', teamData.country);
    formData.append('teamPrincipal', teamData.teamPrincipal);
    formData.append('technicalChief', teamData.technicalChief);
    formData.append('engineSupplier', teamData.engineSupplier);
    formData.append('chassis', teamData.chassis);
    formData.append('status', teamData.status);
  
    if (teamData.imageFile) {
      formData.append('imageFile', teamData.imageFile);
    }
  
    axios
      .put(`https://localhost:7092/api/Team/UpdateTeam`, formData)
      .then((response) => {
        console.log('Update successful:', response);
        toast.success('Update successful');
        navigate('/TeamList');
      })
      .catch((error) => {
        console.error('Error updating team data:', error);
        if (error.response) {
          // Print the error response from the backend
          console.log('Backend response:', error.response.data);
        }
        toast.error('Error updating team data');
      });
  };
  

  return (
    <div>
      <AdminNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Team Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Team Name"
                fullWidth
                value={teamData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={Boolean(nameError)}
                helperText={nameError}
              />
            </Grid>
            <Grid item xs={12}>
  <TextField
    label="Country"
    fullWidth
    value={teamData.country}
    onChange={(e) => handleFieldChange('country', e.target.value)}
    error={Boolean(countryError)}
    helperText={countryError}
  />
</Grid>
<Grid item xs={12}>
  <TextField
    label="Team Principal"
    fullWidth
    value={teamData.teamPrincipal}
    onChange={(e) => handleFieldChange('teamPrincipal', e.target.value)}
    error={Boolean(teamPrincipalError)}
    helperText={teamPrincipalError}
  />
</Grid>

<Grid item xs={12}>
  <TextField
    label="Engine Supplier"
    fullWidth
    value={teamData.engineSupplier}
    onChange={(e) => handleFieldChange('engineSupplier', e.target.value)}
    error={Boolean(engineSupplierError)}
    helperText={engineSupplierError}
  />
</Grid>
<Grid item xs={12}>
  <TextField
    label="Chassis"
    fullWidth
    value={teamData.chassis}
    onChange={(e) => handleFieldChange('chassis', e.target.value)}
    error={Boolean(chassisError)}
    helperText={chassisError}
  />
</Grid>
<Grid item xs={12}>
  <TextField
    label="Status"
    fullWidth
    value={teamData.status}
    onChange={(e) => handleFieldChange('status', e.target.value)}
    error={Boolean(statusError)}
    helperText={statusError}
  />
</Grid>
<Grid item xs={12}>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
  />
</Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            onClick={handleUpdateClick}
          >
            Apply the changes to db
          </Button>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default UpdateTeam;
