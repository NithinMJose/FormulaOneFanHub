import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import Footer from '../LoginSignup/Footer';
import UserNavbar from '../LoginSignup/UserNavbar';
import Option1Image from '../Assets/a.jpg'; // Import your image or use a placeholder
import Option2Image from '../Assets/a.jpg'; // Import your image or use a placeholder
import Option3Image from '../Assets/a.jpg'; // Import your image or use a placeholder
import jwt_decode from 'jwt-decode'; // Import jwt-decode library

const UserVote = () => {
  const location = useLocation();
  const { state } = location;
  const [pollDetails, setPollDetails] = useState(null);

  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Poll/GetPollById?id=${state.pollId}`);
        if (response.ok) {
          const data = await response.json();
          setPollDetails(data);
        } else {
          console.error('Error fetching poll details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching poll details:', error);
      }
    };

    if (state && state.pollId) {
      fetchPollDetails();
    } else {
      console.error('No PollId received.');
      // Handle the case when no PollId is received
    }
  }, [state]);

  const handleOptionClick = async (optionId) => {
    // Decode the JWT token to get the userId
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const userId = parseInt(decodedToken.userId, 10);

    // Make an API call to create a vote
    const voteData = {
      userId,
      pollId: state.pollId,
      optionId,
    };

    try {
      const response = await fetch('https://localhost:7092/api/Poll/CreateVote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      });

      if (response.ok) {
        console.log('Vote cast successfully!');
        // You can add additional logic or UI updates after a successful vote
      } else {
        console.error('Error casting vote:', response.status);
      }
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  return (
    <div>
      <UserNavbar />
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
          {pollDetails ? (
            <div>
              <Typography variant="h4" gutterBottom>
                {pollDetails.question}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card onClick={() => handleOptionClick(1)}>
                    <CardMedia
                      component="img"
                      alt="Option 1"
                      height="140"
                      image={Option1Image}
                    />
                    <CardContent>
                      <Typography variant="h6">{pollDetails.option1}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card onClick={() => handleOptionClick(2)}>
                    <CardMedia
                      component="img"
                      alt="Option 2"
                      height="140"
                      image={Option2Image}
                    />
                    <CardContent>
                      <Typography variant="h6">{pollDetails.option2}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {pollDetails.option3 && (
                  <Grid item xs={12} sm={4}>
                    <Card onClick={() => handleOptionClick(3)}>
                      <CardMedia
                        component="img"
                        alt="Option 3"
                        height="140"
                        image={Option3Image}
                      />
                      <CardContent>
                        <Typography variant="h6">{pollDetails.option3}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
              <Typography style={{ marginTop: '20px' }}>
                Polling Time Ends On: {new Date(pollDetails.pollingDate).toLocaleString()}
              </Typography>
              
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body2" style={{ marginTop: '10px' }}>
                Loading poll details...
              </Typography>
            </div>
          )}
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default UserVote;
