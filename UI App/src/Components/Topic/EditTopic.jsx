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


const EditTopic = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [topic, setTopic] = useState({
    topicId: null,
    title: '',
    content: '',
    createdOn: '',
    userId: null,
    user: null,
  });

  const [decodedUserId, setDecodedUserId] = useState(null);
  const [decodedUserName, setDecodedUserName] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');

  // Validation and error state for updatedTitle
  const [titleError, setTitleError] = useState('');

  // Validation and error state for updatedContent
  const [contentError, setContentError] = useState('');

  useEffect(() => {
    const getTopicById = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Topic/GetTopicById?id=${state.topicId}`);
        const data = await response.json();
        setTopic(data);

        // Set initial values for input fields
        setUpdatedTitle(data.title);
        setUpdatedContent(data.content);
      } catch (error) {
        console.error('Error fetching topic:', error);
      }
    };

    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = jwt_decode(token);
      setDecodedUserId(decodedToken.userId);
      setDecodedUserName(decodedToken.userName);
    }

    getTopicById();
  }, [state.topicId]);

  const handleUpdate = async () => {
    // Validation for updatedTitle
    if (updatedTitle.trim().length < 5) {
      setTitleError('Title should be at least 5 characters long');
      return;
    } else {
      setTitleError('');
    }

    // Validation for updatedContent
    if (updatedContent.trim().length < 10) {
      setContentError('Content should be at least 10 characters long');
      return;
    } else {
      setContentError('');
    }

    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const userId = parseInt(decodedToken.userId, 10);

    const updatedTopic = {
      topicId: state.topicId,
      title: updatedTitle,
      content: updatedContent,
      createdOn: topic.createdOn,
      userId: userId,
      userName: decodedUserName,
    };

    try {
      const response = await fetch('https://localhost:7092/api/Topic/UpdateTopic', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTopic),
      });

      if (response.ok) {
        console.log('Topic updated successfully!');
        navigate('/TopicListAdmin');

        // You can redirect or show a success message here
      } else {
        console.error('Error updating topic:', response.status);
      }
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <br />

      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Edit Topic
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Updated Title"
                fullWidth
                value={updatedTitle}
                onChange={(e) => {
                  setUpdatedTitle(e.target.value);
                  // Validation for updatedTitle
                  if (e.target.value.trim().length < 5) {
                    setTitleError('Title should be at least 5 characters long');
                  } else {
                    setTitleError('');
                  }
                }}
                error={Boolean(titleError)}
                helperText={titleError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Updated Content"
                multiline
                fullWidth
                value={updatedContent}
                onChange={(e) => {
                  setUpdatedContent(e.target.value);
                  // Validation for updatedContent
                  if (e.target.value.trim().length < 10) {
                    setContentError('Content should be at least 10 characters long');
                  } else {
                    setContentError('');
                  }
                }}
                error={Boolean(contentError)}
                helperText={contentError}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Topic
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

export default EditTopic;
