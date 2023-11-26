import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper, List, ListItem, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import Footer from '../LoginSignup/Footer';
import UserNavbar from '../LoginSignup/UserNavbar';

const TeamHistoryUserView = () => {
  const { id } = useParams();
  const [teamHistories, setTeamHistories] = useState([]);

  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/TeamHistory/GetAllTeamHistories`)
      .then((response) => {
        setTeamHistories(response.data);
        console.log('Team Histories:', response.data); // Log the data received from the endpoint
      })
      .catch((error) => {
        console.error('Error fetching Team histories:', error);
      });
  }, []);

  const selectedTeamHistory = teamHistories.find((history) => history.historyId === parseInt(id));

  return (
    <div>
      <UserNavbar />
      <div className="team-history-user-view-container">
        <div className="team-history-user-view-content">
          {selectedTeamHistory ? (
            <Paper elevation={3} className="team-history-user-view-paper" style={{ padding: '20px', marginBottom: '20px' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {selectedTeamHistory.heading}
              </Typography>
              <Typography variant="body1" paragraph style={{ fontSize: '18px' }}>
                {selectedTeamHistory.paragraph}
              </Typography>
              <Divider />
            </Paper>
          ) : null}
          <div className="team-histories-list">
            <Typography variant="h6" color="primary" gutterBottom style={{ fontSize: '24px' }}>
              All Team Histories
            </Typography>
            <List>
              {teamHistories.map((history) => (
                <React.Fragment key={history.historyId}>
                  <ListItem disablePadding>
                    <Typography variant="subtitle1" style={{ fontSize: '20px' }}>
                      {history.heading}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2" style={{ fontSize: '16px' }}>
                      {history.paragraph}
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default TeamHistoryUserView;
