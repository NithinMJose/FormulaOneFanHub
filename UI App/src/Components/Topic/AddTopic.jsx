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
import TeamSidebar from '../sidebar/TeamSidebar';
import { BASE_URL } from '../../config';

const AddTopic = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const [titleError, setTitleError] = useState('');
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

  const validateTitle = (value) => {
    if (!value || value.length < 3) {
      setTitleError('Title should be at least 3 characters long');
      return false;
    } else {
      setTitleError('');
      return true;
    }
  };

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

    isValid = isValid && validateTitle(title);
    isValid = isValid && validateContent(content);

    return isValid;
  };

  const handleSave = async () => {
    const decodedToken = jwt_decode(token);
    const numericUserId = parseInt(decodedToken.userId);
  console.log('User ID:', numericUserId);
  console.log('Request Body:', {
    title,
    content,
    userId: numericUserId,
    UserName : userName,
  });
    if (validateForm()) {
      setLoading(true);

      try {
        const decodedToken = jwt_decode(token);
        const numericUserId = parseInt(decodedToken.userId);
        const createTopicResponse = await fetch(`${BASE_URL}/api/Topic/InsertTopic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            userId: numericUserId,
            userName : userName // Replace with the actual user ID or get it from the token
          }),
        });

        if (createTopicResponse.status === 201) {
          toast.success('Topic added successfully');
          navigate('/TopicListAdmin'); // Adjust the route as needed
          // Additional logic or navigation can be added here
        } else {
          const errorData = await createTopicResponse.json();
          console.error('Topic creation failed:', errorData);
          toast.error('Topic creation failed');
        }
      } catch (error) {
        console.error('Topic creation failed:', error);
        toast.error('Topic creation failed');
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
      <div className="container-fluid">
        <div className="row">
          <TeamSidebar /> {/* Display the TeamSidebar component as a sidebar */}
          <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Container component="main" maxWidth="xs">
              <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                <Typography variant="h5" align="center" gutterBottom>
                  Add Topic
                </Typography>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        name="testTopic"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          validateTitle(e.target.value);
                        }}
                        error={Boolean(titleError)}
                        helperText={titleError}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="testContent"
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
                    id="AddTopicButton"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 20 }}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Topic'}
                  </Button>
                </form>
              </Paper>
            </Container>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
  
};

export default AddTopic;
