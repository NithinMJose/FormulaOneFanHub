import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';

const TeamHistoryList = () => {
  const [teamHistories, setTeamHistories] = useState([]);

  useEffect(() => {
    axios
      .get('https://localhost:7092/api/TeamHistory/GetAllTeamHistories')
      .then((response) => {
        setTeamHistories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Team histories:', error);
      });
  }, []);

  return (
    <div>
      <AdminNavbar />
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
                      <Link to={`/TeamHistoryUpdate/${history.historyId}`}>
                        <Button variant="contained" color="primary" className="btn-edit">
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default TeamHistoryList;
