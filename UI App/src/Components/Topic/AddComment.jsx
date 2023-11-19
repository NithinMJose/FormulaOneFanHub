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

const AddComment = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const [contentError, setContentError] = useState('');

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userIdJ, setUserId ]= useState('');

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
    return validateContent(content);
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const decodedToken = jwt_decode(token);
        const numericUserId = parseInt(decodedToken.userId);
        const createCommentResponse = await fetch('https://localhost:7092/api/Comment/InsertComment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            userId: numericUserId,
            topicId: 1, // Replace with the actual topic ID or get it from the page
            userName,
          }),
        });

        if (createCommentResponse.status === 201) {
          toast.success('Comment added successfully');
          // Additional logic or navigation can be added here
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
