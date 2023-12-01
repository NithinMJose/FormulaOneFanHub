import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, TextField, Button, Container, Grid, Paper } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

const EditTeamHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [teamHistory, setTeamHistory] = useState({
    historyId: state.historyId,
    heading: '',
    paragraph: '',
  });

  useEffect(() => {
    const fetchTeamHistory = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7092/api/TeamHistory/GetTeamHistoryById?id=${state.historyId}`
        );
        setTeamHistory(response.data);
      } catch (error) {
        console.error('Error fetching team history:', error);
      }
    };

    fetchTeamHistory();
  }, [state.historyId]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `https://localhost:7092/api/TeamHistory/UpdateTeamHistory?id=${teamHistory.historyId}`,
        teamHistory
      );
  
      console.log('Response:', response);
  
      if (response.status === 200) {
        console.log('Team history updated successfully!');
        navigate('/TeamHistoryList');
      } else {
        console.error('Error updating team history:', response.status);
      }
    } catch (error) {
      console.error('Error updating team history:', error);
    }
  };
  

  return (
    <div>
      <AdminNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Edit Team History
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Heading"
                fullWidth
                value={teamHistory.heading}
                onChange={(e) => setTeamHistory({ ...teamHistory, heading: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Paragraph"
                multiline
                fullWidth
                value={teamHistory.paragraph}
                onChange={(e) => setTeamHistory({ ...teamHistory, paragraph: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Team History
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <br />
      <Footer />
    </div>
  );
};

export default EditTeamHistory;
