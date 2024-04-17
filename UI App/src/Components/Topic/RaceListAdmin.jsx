import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import axios from 'axios';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const RaceListAdmin = () => {
  const navigate = useNavigate();
  const [raceData, setRaceData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      axios
        .get(`${BASE_URL}/api/Race/GetAllRaces`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRaceData(response.data);
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
      console.error('An error occurred while decoding the token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const renderRaceData = () => {
    if (!raceData) {
      return <p>Loading race data...</p>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>Race ID</TableCell>
              <TableCell style={{ width: '15%' }}>Race Name</TableCell>
              <TableCell style={{ width: '15%' }}>Season ID</TableCell>
              <TableCell style={{ width: '15%' }}>Race Date</TableCell>
              <TableCell style={{ width: '20%' }}>Race Location</TableCell>
              <TableCell style={{ width: '20%' }}>Image</TableCell>
              <TableCell style={{ width: '10%' }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {raceData.map((race) => (
              <TableRow key={race.raceId}>
                <TableCell>{race.raceId}</TableCell>
                <TableCell>{race.raceName}</TableCell>
                <TableCell>{race.seasonId}</TableCell>
                <TableCell>{new Date(race.raceDate).toLocaleString()}</TableCell>
                <TableCell>{race.raceLocation}</TableCell>
                <TableCell>
                  {race.imagePath && (
                    <img
                      src={`${BASE_URL}/images/${race.imagePath}`}
                      alt={`Race ${race.raceName}`}
                      style={{ maxWidth: '100%', maxHeight: '100px' }}
                    />
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

  const handleManageRace = (raceId) => {
    navigate(`/EditRace`, { replace: true, state: { raceId } });
  };

  return (
    <div className="racelistadmin">
      <AdminNavbar />
      <br />
      {renderRaceData()}
      <br />
      <Footer />
    </div>
  );
};

export default RaceListAdmin;
