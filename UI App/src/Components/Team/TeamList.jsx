import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import './TeamList.css'; // Make sure to include your TeamList.css file
import AdminNavbar from '../LoginSignup/AdminNavbar';

const TeamList = () => {
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/Team/GetTeams`)
      .then((response) => {
        setTeamData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching team data:', error);
        if (error.response && error.response.status ===  401) {
          // Handle unauthorized access
          navigate('/login');
        } else {
          // Handle other errors
        }
      });
  }, [navigate]);

  const handleManageTeam = (teamId) => {
    // Redirect to the UpdateTeam page with the specific teamId
    navigate(`/UpdateTeam`, { replace: true, state: { teamId } });
  };

  const renderTeamData = () => {
    if (!teamData) {
      return <p>Loading team data...</p>;
    }

    return (
      <>
        <AdminNavbar />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Team Principal</TableCell>
              <TableCell>Technical Chief</TableCell>
              <TableCell>Engine Supplier</TableCell>
              <TableCell>Chassis</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamData.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.id}</TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.country}</TableCell>
                <TableCell>{team.teamPrincipal}</TableCell>
                <TableCell>{team.technicalChief}</TableCell>
                <TableCell>{team.engineSupplier}</TableCell>
                <TableCell>{team.chassis}</TableCell>
                <TableCell>
                  {team.imagePath ? (
                    <img
                      src={`https://localhost:7092/images/${team.imagePath}`}
                      alt={`Image for ${team.name}`}
                      className="team-image"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: '150px', height: '150px' }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </TableCell>
                <TableCell>{team.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManageTeam(team.id)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </>
    );
  };

  return (
    <div className="teamlistpage">
      {renderTeamData()}
    </div>
  );
};

export default TeamList;
