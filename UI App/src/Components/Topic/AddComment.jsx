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
import { BASE_URL } from '../../config';

const AddComment = () => {
  const [topicId, setTopicId] = useState(''); // New state for Topic Id
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const [contentError, setContentError] = useState('');

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

  const validateContent = (value) => {
    if (!value || value.length < 5) {
      setContentError('Content should be at least 5 characters long');
      return false;
    } else {
      setContentError('');
      return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateContent(content);

    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const decodedToken = jwt_decode(token);
        const numericUserId = parseInt(decodedToken.userId);
        const createCommentResponse = await fetch(`${BASE_URL}/api/Comment/InsertComment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            userId: numericUserId,
            userName,
            topicId, // Use the Topic Id state here
          }),
        });

        if (createCommentResponse.status === 201) {
          toast.success('Comment added successfully');
          // You may choose to navigate back to the topic details or perform any other actions
        } else {
          const errorData = await createCommentResponse.json();
          console.error('Comment creation failed:', errorData);
          toast.error('Comment creation failed');
        }
      } catch (error) {
        console.error('Comment creation failed:', error);
        toast.error('Comment creation failed');
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
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add Comment
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* New TextField for Topic Id */}
                <TextField
                  label="Topic Id"
                  variant="outlined"
                  fullWidth
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Content"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    validateContent(e.target.value);
                  }}
                  error={Boolean(contentError)}
                  helperText={contentError}
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
              {loading ? 'Adding...' : 'Add Comment'}
            </Button>
          </form>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default AddComment;
