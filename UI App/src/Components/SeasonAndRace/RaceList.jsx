import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';

const RaceList = () => {
  const navigate = useNavigate();
  const [racesData, setRacesData] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      axios
        .get(`https://localhost:7092/api/Race/GetAllRaces`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRacesData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching race data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            navigate('/');
          } else {
            toast.error('An error occurred while fetching race data');
          }
        });
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const handleManageRace = (raceId) => {
    // Redirect to the UpdateRace page with the specific raceId
    navigate(`/UpdateRace/${raceId}`);
  };

  const renderRacesData = () => {
    if (!racesData) {
      return <p>Loading race data...</p>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>Sl No.</TableCell>
              <TableCell style={{ width: '15%' }}>Race Name</TableCell>
              <TableCell style={{ width: '20%' }}>Race Date</TableCell>
              <TableCell style={{ width: '20%' }}>Location</TableCell>
              <TableCell style={{ width: '20%' }}>Image</TableCell>
              <TableCell style={{ width: '15%' }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {racesData.map((race, index) => (
              <TableRow key={race.raceId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{race.raceName}</TableCell>
                <TableCell>{new Date(race.raceDate).toLocaleDateString()}</TableCell>
                <TableCell>{race.raceLocation}</TableCell>
                <TableCell>
                  {race.imagePath ? (
                    <img
                      src={`https://localhost:7092/images/${race.imagePath}`}
                      alt={`Image for ${race.raceName}`}
                      className="race-image"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: '150px', height: '150px' }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManageRace(race.raceId)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="racelistpage">
      <AdminNavbar />
      <br />
      {renderRacesData()}
      <br />
      <Footer />
    </div>
  );
};

export default RaceList;
