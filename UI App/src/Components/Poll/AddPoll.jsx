import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
} from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';

const AddPoll = () => {
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [pollingDate, setPollingDate] = useState('');
  const [loading, setLoading] = useState(false);

  const [questionError, setQuestionError] = useState('');
  const [option1Error, setOption1Error] = useState('');
  const [option2Error, setOption2Error] = useState('');
  const [option3Error, setOption3Error] = useState('');
  const [pollingDateError, setPollingDateError] = useState('');

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserName(decodedToken.userName);
      setUserId(decodedToken.userIdJ);
      console.log('Decoded Token:', decodedToken);
    }
  }, [token]);

  const validateQuestion = (value) => {
    if (!value || value.length < 5) {
      setQuestionError('Question should be at least 5 characters long');
      return false;
    } else {
      setQuestionError('');
      return true;
    }
  };

  const validateOption1 = (value) => {
    if (!value || value.length === 0) {
      setOption1Error('Option1 is required');
      return false;
    } else {
      setOption1Error('');
      return true;
    }
  };

  const validateOption2 = (value) => {
    if (!value || value.length === 0) {
      setOption2Error('Option2 is required');
      return false;
    } else {
      setOption2Error('');
      return true;
    }
  };

  const validateOption3 = (value) => {
    if (!value || value.length === 0) {
      setOption3Error('Option3 is required');
      return false;
    } else {
      setOption3Error('');
      return true;
    }
  };

  const validatePollingDate = (value) => {
    // You can add additional validation for polling date if needed
    // For now, it checks if the value is not empty
    if (!value) {
      setPollingDateError('Polling Date is required');
      return false;
    } else {
      setPollingDateError('');
      return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateQuestion(question);
    isValid = isValid && validateOption1(option1);
    isValid = isValid && validateOption2(option2);
    isValid = isValid && validateOption3(option3);
    isValid = isValid && validatePollingDate(pollingDate);

    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const createPollResponse = await fetch('https://localhost:7092/api/Poll/CreatePoll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            option1,
            option2,
            option3,
            pollingDate,
          }),
        });

        if (createPollResponse.status === 201) {
          toast.success('Poll added successfully');
          navigate('/PollList');
          // You may choose to navigate back to the poll list or perform any other actions
        } else {
          const errorData = await createPollResponse.json();
          console.error('Poll creation failed:', errorData);
          toast.error('Poll creation failed');
        }
      } catch (error) {
        console.error('Poll creation failed:', error);
        toast.error('Poll creation failed');
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
      <Container component="main" maxWidth="xs" style={{ marginTop: "100px" }}>
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add Poll
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Question"
                  variant="outlined"
                  fullWidth
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    validateQuestion(e.target.value);
                  }}
                  error={Boolean(questionError)}
                  helperText={questionError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Option1"
                  variant="outlined"
                  fullWidth
                  value={option1}
                  onChange={(e) => {
                    setOption1(e.target.value);
                    validateOption1(e.target.value);
                  }}
                  error={Boolean(option1Error)}
                  helperText={option1Error}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Option2"
                  variant="outlined"
                  fullWidth
                  value={option2}
                  onChange={(e) => {
                    setOption2(e.target.value);
                    validateOption2(e.target.value);
                  }}
                  error={Boolean(option2Error)}
                  helperText={option2Error}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Option3"
                  variant="outlined"
                  fullWidth
                  value={option3}
                  onChange={(e) => {
                    setOption3(e.target.value);
                    validateOption3(e.target.value);
                  }}
                  error={Boolean(option3Error)}
                  helperText={option3Error}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Polling Date"
                  variant="outlined"
                  fullWidth
                  type="datetime-local" // Adjust the type according to your needs
                  value={pollingDate}
                  onChange={(e) => {
                    setPollingDate(e.target.value);
                    validatePollingDate(e.target.value);
                  }}
                  error={Boolean(pollingDateError)}
                  helperText={pollingDateError}
                />
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
              {loading ? 'Adding...' : 'Add Poll'}
            </Button>
          </form>
        </Paper>
      </Container>
      <br />
      <Footer />
    </div>
  );
};

export default AddPoll;
