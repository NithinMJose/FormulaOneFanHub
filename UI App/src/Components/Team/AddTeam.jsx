import React, { useState } from 'react';
import './AddTeam.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../LoginSignup/Footer';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, InputAdornment, Typography, Container } from '@mui/material';
import AdminSidebar from '../sidebar/adminSidebar';

const AddTeam = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [teamPrincipal, setTeamPrincipal] = useState('');
  const [technicalChief, setTechnicalChief] = useState('');
  const [engineSupplier, setEngineSupplier] = useState('');
  const [chassis, setChassis] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [teamPrincipalError, setTeamPrincipalError] = useState('');
  const [technicalChiefError, setTechnicalChiefError] = useState('');
  const [engineSupplierError, setEngineSupplierError] = useState('');
  const [chassisError, setChassisError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

  const [open, setOpen] = useState(false); // State for collapsible section

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateName(name);
    isValid = isValid && validateCountry(country);
    isValid = isValid && validateTeamPrincipal(teamPrincipal);
    isValid = isValid && validateTechnicalChief(technicalChief);
    isValid = isValid && validateEngineSupplier(engineSupplier);
    isValid = isValid && validateChassis(chassis);
    isValid = isValid && validateImage(imageFile);

    return isValid;
  };

  const validateName = (value) => {
    if (value.trim().replace(/\s/g, '').length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
      setNameError('Should be at least 3 characters long and contain only alphabets and spaces');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateCountry = (value) => {
    if (value.trim().replace(/\s/g, '').length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
        setCountryError('Should be at least 3 characters long and contain only alphabets and spaces');
        return false;
      } else {
        setCountryError('');
        return true;
      }
  };

  const validateTeamPrincipal = (value) => {
    if (value.trim().replace(/\s/g, '').length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
        setTeamPrincipalError('Should be at least 3 characters long and contain only alphabets and spaces');
        return false;
      } else {
        setTeamPrincipalError('');
        return true;
      }
  };

  const validateTechnicalChief = (value) => {
    if (value.trim().replace(/\s/g, '').length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
        setTechnicalChiefError('Should be at least 3 characters long and contain only alphabets and spaces');
        return false;
      } else {
        setTechnicalChiefError('');
        return true;
      }
  };

  const validateEngineSupplier = (value) => {
    if (value.trim().replace(/\s/g, '').length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
        setEngineSupplierError('Should be at least 3 characters long and contain only alphabets and spaces');
        return false;
      } else {
        setEngineSupplierError('');
        return true;
      }
  };

  const validateChassis = (value) => {
    if (value.trim().replace(/\s/g, '').length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
        setChassisError('Should be at least 3 characters long and contain only alphabets and spaces');
        return false;
      } else {
        setChassisError('');
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

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('country', country);
        formData.append('teamPrincipal', teamPrincipal);
        formData.append('technicalChief', technicalChief);
        formData.append('engineSupplier', engineSupplier);
        formData.append('chassis', chassis);
        formData.append('imageFile', imageFile);
        formData.append('status', status); // Include status in the form data

        const createTeamResponse = await fetch('https://localhost:7092/api/Team/CreateTeam', {
          method: 'POST',
          body: formData,
        });

        if (createTeamResponse.status === 201) {
          toast.success('Team added successfully');
          navigate('/TeamList');
          // Additional logic or navigation can be added here
        } else {
          const errorData = await createTeamResponse.json();
          console.error('Team creation failed:', errorData);
          toast.error('Team creation failed');
        }
      } catch (error) {
        console.error('Team creation failed:', error);
        toast.error('Team creation failed');
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
      <Container className="outerSetup" maxWidth="550px" width="100%">
        <div style={{ display: 'flex' }}>
          <AdminSidebar />
          
          {/* Main Content */}
          <div className="main-content">
            <br />
            <br />
            <div className="add-team-container">
              <div className="add-team-panel">
                <Typography variant="h5" className="add-team-header">
                  Add Team
                </Typography>
                <div className="add-team-inputsadmin">
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      validateName(e.target.value);
                    }}
                    error={Boolean(nameError)}
                    helperText={nameError}
                  />
                  <TextField
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    error={Boolean(countryError)}
                    helperText={countryError}
                  />
                  <TextField
                    label="Team Principal"
                    variant="outlined"
                    fullWidth
                    value={teamPrincipal}
                    onChange={(e) => setTeamPrincipal(e.target.value)}
                    error={Boolean(teamPrincipalError)}
                    helperText={teamPrincipalError}
                  />
                  <TextField
                    label="Technical Chief"
                    variant="outlined"
                    fullWidth
                    value={technicalChief}
                    onChange={(e) => setTechnicalChief(e.target.value)}
                    error={Boolean(technicalChiefError)}
                    helperText={technicalChiefError}
                  />
                  <TextField
                    label="Engine Supplier"
                    variant="outlined"
                    fullWidth
                    value={engineSupplier}
                    onChange={(e) => setEngineSupplier(e.target.value)}
                    error={Boolean(engineSupplierError)}
                    helperText={engineSupplierError}
                  />
                  <TextField
                    label="Chassis"
                    variant="outlined"
                    fullWidth
                    value={chassis}
                    onChange={(e) => setChassis(e.target.value)}
                    error={Boolean(chassisError)}
                    helperText={chassisError}
                  />
                  <input
                    accept="image/jpeg, image/jpg, image/png"
                    style={{ display: 'none' }}
                    id="image-file-input"
                    type="file"
                    onChange={(e) => {
                      setImageFile(e.target.files[0]);
                      validateImage(e.target.files[0]);
                    }}
                  />
                  <label htmlFor="image-file-input">
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
                  {imageFileError && (
                    <Typography variant="caption" color="error">
                      {imageFileError}
                    </Typography>
                  )}
                </div>
                <div className="add-team-submit-container">
                  <Button
                    variant="contained"
                    color="primary"
                    className="add-team-submit"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Team'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
      </Container>
      <Footer />
    </div>
  );
};  

export default AddTeam;
