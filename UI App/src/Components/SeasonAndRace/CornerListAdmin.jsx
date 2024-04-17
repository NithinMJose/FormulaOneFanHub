import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const CornerListAdmin = () => {
  const navigate = useNavigate();
  const [cornerData, setCornerData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      axios
        .get(`${BASE_URL}/api/Corner/GetAllCorners`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCornerData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching corner data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            navigate('/');
          } else {
            toast.error('An error occurred while fetching corner data');
          }
        });
    } catch (error) {
      console.error('An error occurred while decoding the token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const renderCornerData = () => {
    if (!cornerData) {
      return <p>Loading corner data...</p>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>Corner ID</TableCell>
              <TableCell style={{ width: '15%' }}>Corner Number</TableCell>
              <TableCell style={{ width: '15%' }}>Corner Capacity</TableCell>
              <TableCell style={{ width: '15%' }}>Race ID</TableCell>
              <TableCell style={{ width: '20%' }}>Race Name</TableCell>
              <TableCell style={{ width: '15%' }}>Available Capacity</TableCell>
              <TableCell style={{ width: '15%' }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cornerData.map((corner) => (
              <TableRow key={corner.cornerId}>
                <TableCell>{corner.cornerId}</TableCell>
                <TableCell>{corner.cornerNumber}</TableCell>
                <TableCell>{corner.cornerCapacity}</TableCell>
                <TableCell>{corner.raceId}</TableCell>
                <TableCell>{corner.race ? corner.race.raceName : ''}</TableCell>
                <TableCell>{corner.availableCapacity}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManageCorner(corner.cornerId)}
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

  const handleManageCorner = (cornerId) => {
    navigate(`/EditCorner`, { state: { cornerId } });
  };

  return (
    <div className="cornerlistadmin">
      <AdminNavbar />
      <br />
      <br />
      <br />
      <br />
      <h1>Corner List</h1>
      {renderCornerData()}
      <br />
      <Footer />
    </div>
  );
};

export default CornerListAdmin;
