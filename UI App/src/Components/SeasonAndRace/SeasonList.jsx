import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import axios from 'axios';
import './SeasonList.css'; // Make sure to include your SeasonList.css file
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';
const SeasonList = () => {
  const navigate = useNavigate();
  const [seasonsData, setSeasonsData] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      // Add token decoding logic if needed

      axios
        .get(`${BASE_URL}/api/Season/GetSeasons`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSeasonsData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching season data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            navigate('/');
          } else {
            toast.error('An error occurred while fetching season data');
          }
        });
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const handleManageSeason = (seasonId) => {
    // Redirect to the UpdateSeason page with the specific seasonId
    navigate(`/EditSeason`, { replace: true, state: {seasonId } });
  };

  const renderSeasonsData = () => {
    if (!seasonsData) {
      return <p>Loading season data...</p>;
    }
  
    // Sort the seasonsData array based on the year in ascending order
    const sortedSeasonsData = [...seasonsData].sort((a, b) => a.year - b.year);
  
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>Sl No.</TableCell>
              <TableCell style={{ width: '15%' }}>Year</TableCell>
              <TableCell style={{ width: '20%' }}>Champion</TableCell>
              <TableCell style={{ width: '40%' }}>Image</TableCell>
              <TableCell style={{ width: '20%' }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSeasonsData.map((season, index) => (
              <TableRow key={season.seasonId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{season.year}</TableCell>
                <TableCell>{season.champion}</TableCell>
                <TableCell>
                  {season.imagePath ? (
                    <img
                      src={`${BASE_URL}/images/${season.imagePath}`}
                      alt={`Image for ${season.year}`}
                      className="season-image"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: '150px', height: '150px' }}
                      onLoad={() => console.log(`Image loaded for ${season.year}: ${season.imagePath}`)}
                      onError={() => console.error(`Error loading image for ${season.year}: ${season.imagePath}`)}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManageSeason(season.seasonId)}
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
    <div className="seasonlistpage">
      <AdminNavbar />
      <br />
      <br />
      <br />
      <br />
      {renderSeasonsData()}
      <br />
      <Footer />
    </div>
  );
};

export default SeasonList;
