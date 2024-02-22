import React, { useState } from 'react';
import './AddTeam.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../LoginSignup/Footer';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container } from '@mui/material';
import AdminSidebar from '../sidebar/adminSidebar';

const AddTeam = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateName(name);
    isValid = isValid && validateEmail(email);

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

  const validateEmail = (value) => {
    // You can add email validation logic here if needed
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const response = await fetch('https://localhost:7092/api/Team/CreateTeam', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ UserName: name, Email: email }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data);
          toast.success('Team Creation details are sent to the user via email.');
          navigate('/TeamList');
          // Additional logic or navigation can be added here
        } else {
          console.error('Team creation failed:', response.statusText);
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
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={Boolean(emailError)}
                    helperText={emailError}
                  />
                </div>
                <div className="add-team-submit-container">
                  <Button
                    variant="contained"
                    color="primary"
                    className="add-team-submit"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Submit'}
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
