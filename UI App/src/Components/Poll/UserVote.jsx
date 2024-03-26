import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import Footer from '../LoginSignup/Footer';
import UserNavbar from '../LoginSignup/UserNavbar';
import Option1Image from '../Assets/a.jpg';
import Option2Image from '../Assets/a.jpg';
import Option3Image from '../Assets/a.jpg';
import jwt_decode from 'jwt-decode';

const UserVote = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add this line to use the navigate function
  const { state } = location;
  const [pollDetails, setPollDetails] = useState(null);

  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        const pollResponse = await fetch(`https://localhost:7092/api/Poll/GetPollById?id=${state.pollId}`);
        const votesResponse = await fetch(`https://localhost:7092/api/Vote/GetVotesByPoll?pollId=${state.pollId}`);
  
        if (pollResponse.ok && votesResponse.ok) {
          const pollData = await pollResponse.json();
          const votesData = await votesResponse.json();
  
          setPollDetails(pollData);
  
          // Check if the user has already voted
          const token = localStorage.getItem('jwtToken');
          const decodedToken = jwt_decode(token);
          const userId = parseInt(decodedToken.userId, 10);
          console.log('UserId from token:', userId);
  
          // Log the received data and votes
          console.log('Received data:', pollData);
          console.log('Votes from data:', votesData);
  
          // Ensure that votesData is available before checking
          const userHasVoted = votesData && votesData.some(vote => vote.userId === userId);
  
          if (userHasVoted) {
            console.log('User has already voted. Redirecting to UserVoteResult...');
            navigate('/UserVoteResult', { replace: true, state: { pollId: state.pollId, userId } });
          } else {
            console.log('User has not voted yet.');
          }
        } else {
          console.error('Error fetching poll details 1:', pollResponse.status);
          console.log('Poll response:', pollResponse.status);
          console.error('Vote response :', votesResponse.status);
        }
      } catch (error) {
        console.error('Error fetching poll details 2:', error);
      }
    };
  
    if (state && state.pollId) {
      fetchPollDetails();
    } else {
      console.error('No PollId received.');
      // Handle the case when no PollId is received
    }
  }, [state, navigate]);
  
  
  const handleOptionClick = async (optionId) => {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const userId = parseInt(decodedToken.userId, 10);

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
        console.log('UserId:', userId);
        navigate('/UserVoteResult', { replace: true, state: { pollId: state.pollId, userId } });
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
      <Container maxWidth="md" style={{ marginTop: "100px" }}>
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
