import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Paper, CircularProgress, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/system';

import Option1Image from '../Assets/a.jpg';
import Option2Image from '../Assets/a.jpg';
import Option3Image from '../Assets/a.jpg';
import Footer from '../LoginSignup/Footer';
import UserNavbar from '../LoginSignup/UserNavbar';

const ResultCard = styled(Card)({
  position: 'relative',
  overflow: 'visible',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const UserVoteResult = () => {
  const location = useLocation();
  const { state } = location;
  const [pollDetails, setPollDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [votes, setVotes] = useState([]);
  const [responseBody, setResponseBody] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state && state.pollId && state.userId) {
      // Simulating API calls with setTimeout for demonstration purposes
      const fetchData = async () => {
        try {
          const pollResponse = await fetch(`https://localhost:7092/api/Poll/GetPollById?id=${state.pollId}`);
          const userResponse = await fetch(`https://localhost:7092/api/User/GetUserDetailsFromUserId?userId=${state.userId}`);
          const votesResponse = await fetch(`https://localhost:7092/api/Vote/GetVotesByPoll?pollId=${state.pollId}`);

          if (pollResponse.ok && userResponse.ok && votesResponse.ok) {
            const pollData = await pollResponse.json();
            const userData = await userResponse.json();
            const votesData = await votesResponse.json();

            setPollDetails(pollData);
            setUserDetails(userData);
            setVotes(votesData);
            setResponseBody(JSON.stringify(votesData, null, 2));
          } else {
            console.error('Error fetching data:', pollResponse.status, userResponse.status, votesResponse.status);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      // Simulating a delay in fetching data (remove this in a real scenario)
      const delay = setTimeout(() => {
        fetchData();
      }, 1500);

      return () => clearTimeout(delay);
    }
  }, [state]);

  const countVotesByOption = (optionId) => {
    return votes.filter((vote) => vote.optionId === optionId).length;
  };

  const totalVotes = votes.length;

  const calculatePercentage = (count) => {
    return totalVotes !== 0 ? ((count / totalVotes) * 100).toFixed(2) : 0;
  };

  return (
    <div>
    <UserNavbar />
      <div style={{ padding: '20px', marginLeft: '5%', marginRight: '5%', marginTop: "100px" }}>
      {loading ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <CircularProgress style={{ marginBottom: '10px' }} />
          <Typography variant="body1">Hang On, We are loading the data...</Typography>
        </div>
      ) : (
        userDetails && pollDetails && (
          <div>
            <Typography variant="h4" style={{ marginBottom: '10px' }}>Thank You {userDetails.userName} for the Vote</Typography>
            <Typography variant="h3" style={{ marginBottom: '20px' }}>{pollDetails.question}</Typography>
            <Paper style={{ padding: '20px', margin: '20px 0', backgroundColor: '#f9f9f9' }}>
              <Typography variant="h5" style={{ marginBottom: '10px' }}>Results:</Typography>
              {totalVotes !== 0 ? (
                <Grid container spacing={2}>
                  {pollDetails.option1 && (
                    <Grid item xs={12} sm={4}>
                      <ResultCard>
                        <CardMedia
                          component="img"
                          alt={pollDetails.option1}
                          height="200"
                          image={Option1Image}
                        />
                        <CardContent>
                          <Typography variant="h6" style={{ marginBottom: '10px' }}>{pollDetails.option1}</Typography>
                          <Typography variant="body2" style={{ marginBottom: '10px' }}>Votes: {countVotesByOption(1)}</Typography>
                          <div
                            style={{
                              backgroundColor: '#4caf50',
                              height: '20px',
                              width: `${calculatePercentage(countVotesByOption(1))}%`,
                              marginTop: '10px',
                            }}
                          />
                        </CardContent>
                      </ResultCard>
                    </Grid>
                  )}
                  {pollDetails.option2 && (
                    <Grid item xs={12} sm={4}>
                      <ResultCard>
                        <CardMedia
                          component="img"
                          alt={pollDetails.option2}
                          height="200"
                          image={Option2Image}
                        />
                        <CardContent>
                          <Typography variant="h6" style={{ marginBottom: '10px' }}>{pollDetails.option2}</Typography>
                          <Typography variant="body2" style={{ marginBottom: '10px' }}>Votes: {countVotesByOption(2)}</Typography>
                          <div
                            style={{
                              backgroundColor: '#2196f3',
                              height: '20px',
                              width: `${calculatePercentage(countVotesByOption(2))}%`,
                              marginTop: '10px',
                            }}
                          />
                        </CardContent>
                      </ResultCard>
                    </Grid>
                  )}
                  {pollDetails.option3 && (
                    <Grid item xs={12} sm={4}>
                      <ResultCard>
                        <CardMedia
                          component="img"
                          alt={pollDetails.option3}
                          height="200"
                          image={Option3Image}
                        />
                        <CardContent>
                          <Typography variant="h6" style={{ marginBottom: '10px' }}>{pollDetails.option3}</Typography>
                          <Typography variant="body2" style={{ marginBottom: '10px' }}>Votes: {countVotesByOption(3)}</Typography>
                          <div
                            style={{
                              backgroundColor: '#f44336',
                              height: '20px',
                              width: `${calculatePercentage(countVotesByOption(3))}%`,
                              marginTop: '10px',
                            }}
                          />
                        </CardContent>
                      </ResultCard>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Typography variant="h6">No votes recorded yet.</Typography>
              )}
            </Paper>
            
          </div>
        )
      )}
    </div>
    <br />
    <Footer />
    </div>
  );
};

export default UserVoteResult;