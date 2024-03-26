import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { useNavigate } from 'react-router-dom';
import TeamSidebar from '../sidebar/TeamSidebar';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';
import jwt_decode from 'jwt-decode';

const TeamHistoryListTeam = () => {
  const navigate = useNavigate();
  const [teamHistories, setTeamHistories] = useState([]);
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const teamId = decoded.teamId;

  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/TeamHistory/GetTeamHistoriesByTeamId?teamId=${teamId}`)
      .then((response) => {
        setTeamHistories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Team histories:', error);
      });
  }, [teamId]); // Add teamId as dependency to refetch data when teamId changes

  const handleEditTeamHistory = (historyId) => {
    navigate(`/EditTeamHistory`, { replace: true, state: {historyId } });
  };

  return (
    <div>
      <TeamNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="container-fluid">
        <div className="row">
          <TeamSidebar /> {/* Display the TeamSidebar component as a sidebar */}
          <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="team-history-container">
              <div className="team-history-content">
                <Typography variant="h4" color="primary" className="team-history-heading">
                  Team History List
                </Typography>
                <TableContainer component={Paper} className="table-responsive">
                  <Table className="team-history-table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="team-history-heading-bg">Serial No</TableCell>
                        <TableCell className="team-history-heading-bg">Heading</TableCell>
                        <TableCell className="team-history-heading-bg">Paragraph</TableCell>
                        <TableCell className="team-history-heading-bg">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamHistories.map((history, index) => (
                        <TableRow key={history.historyId}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{history.heading}</TableCell>
                          <TableCell>{history.paragraph}</TableCell>
                          <TableCell className="team-history-buttons">
                            <Button
                              variant="contained"
                              color="primary"
                              className="btn-edit"
                              onClick={() => handleEditTeamHistory(history.historyId)}>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
  
};

export default TeamHistoryListTeam;
