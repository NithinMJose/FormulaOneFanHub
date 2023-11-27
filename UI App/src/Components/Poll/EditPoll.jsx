import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
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

const EditPoll = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [poll, setPoll] = useState({
    pollId: null,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    createdOn: '',
    pollingDate: '',
  });

  const [decodedUserId, setDecodedUserId] = useState(null);
  const [decodedUserName, setDecodedUserName] = useState(null);
  const [updatedQuestion, setUpdatedQuestion] = useState('');
  const [updatedOption1, setUpdatedOption1] = useState('');
  const [updatedOption2, setUpdatedOption2] = useState('');
  const [updatedOption3, setUpdatedOption3] = useState('');

  // Validation and error state for updatedQuestion
  const [questionError, setQuestionError] = useState('');
  const [option1Error, setOption1Error] = useState('');
  const [option2Error, setOption2Error] = useState('');
  const [option3Error, setOption3Error] = useState('');

  useEffect(() => {
    console.log('Current pollId:', state.pollId);

    const getPollById = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Poll/GetPollById?id=${state.pollId}`);
        const data = await response.json();
        setPoll(data);

        // Set initial values for input fields
        setUpdatedQuestion(data.question);
        setUpdatedOption1(data.option1);
        setUpdatedOption2(data.option2);
        setUpdatedOption3(data.option3);
      } catch (error) {
        console.error('Error fetching poll:', error);
      }
    };

    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = jwt_decode(token);
      setDecodedUserId(decodedToken.userId);
      setDecodedUserName(decodedToken.userName);
    }

    getPollById();
  }, [state.pollId]);

  const handleUpdate = async () => {
    // Validation for updatedQuestion
    if (updatedQuestion.trim().length < 4) {
      setQuestionError('Question should be at least 4 characters long');
      return;
    } else {
      setQuestionError('');
    }

    // Validation for updatedOption1
    if (updatedOption1.trim().length < 4) {
      setOption1Error('Option 1 should be at least 4 characters long');
      return;
    } else {
      setOption1Error('');
    }

    // Validation for updatedOption2
    if (updatedOption2.trim().length < 4) {
      setOption2Error('Option 2 should be at least 4 characters long');
      return;
    } else {
      setOption2Error('');
    }

    // Validation for updatedOption3
    if (updatedOption3.trim().length < 4) {
      setOption3Error('Option 3 should be at least 4 characters long');
      return;
    } else {
      setOption3Error('');
    }

    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const userId = parseInt(decodedToken.userId, 10);

    const updatedPoll = {
      pollId: state.pollId,
      question: updatedQuestion,
      option1: updatedOption1,
      option2: updatedOption2,
      option3: updatedOption3,
      createdOn: poll.createdOn,
      pollingDate: poll.pollingDate,
    };

    try {
      const response = await fetch('https://localhost:7092/api/Poll/UpdatePoll', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPoll),
      });

      if (response.ok) {
        console.log('Poll updated successfully!');
        navigate('/PollList');

        // You can redirect or show a success message here
      } else {
        console.error('Error updating poll:', response.status);
      }
    } catch (error) {
      console.error('Error updating poll:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <br />

      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Edit Poll
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Updated Question"
                fullWidth
                value={updatedQuestion}
                onChange={(e) => {
                  setUpdatedQuestion(e.target.value);
                  // Validation for updatedQuestion
                  if (e.target.value.trim().length < 4) {
                    setQuestionError('Question should be at least 4 characters long');
                  } else {
                    setQuestionError('');
                  }
                }}
                error={Boolean(questionError)}
                helperText={questionError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Updated Option 1"
                fullWidth
                value={updatedOption1}
                onChange={(e) => {
                  setUpdatedOption1(e.target.value);
                  // Validation for updatedOption1
                  if (e.target.value.trim().length < 4) {
                    setOption1Error('Option 1 should be at least 4 characters long');
                  } else {
                    setOption1Error('');
                  }
                }}
                error={Boolean(option1Error)}
                helperText={option1Error}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Updated Option 2"
                fullWidth
                value={updatedOption2}
                onChange={(e) => {
                  setUpdatedOption2(e.target.value);
                  // Validation for updatedOption2
                  if (e.target.value.trim().length < 4) {
                    setOption2Error('Option 2 should be at least 4 characters long');
                  } else {
                    setOption2Error('');
                  }
                }}
                error={Boolean(option2Error)}
                helperText={option2Error}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Updated Option 3"
                fullWidth
                value={updatedOption3}
                onChange={(e) => {
                  setUpdatedOption3(e.target.value);
                  // Validation for updatedOption3
                  if (e.target.value.trim().length < 4) {
                    setOption3Error('Option 3 should be at least 4 characters long');
                  } else {
                    setOption3Error('');
                  }
                }}
                error={Boolean(option3Error)}
                helperText={option3Error}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Poll
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

export default EditPoll;
