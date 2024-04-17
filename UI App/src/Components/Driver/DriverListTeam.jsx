import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import axios from 'axios';
import './DriverList.css'; // Make sure to include your DriverList.css file
import Footer from '../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';
import TeamSidebar from '../sidebar/TeamSidebar';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';

const DriverListTeam = () => {
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
  
    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }
  
    try {
      const tokenPayload = jwt_decode(token);
      const roleId = tokenPayload['RoleId'];
      const teamId = tokenPayload['teamId'];
      const parsedTeamId = parseInt(teamId);
      console.log('TeamId:', parsedTeamId);
  
      if (roleId !== 'Admin' && roleId !== 'Team') {
        toast.error('You have to be logged in as Admin to access the page');
        navigate('/');
        return;
      }
  
      axios
  .get(`https://localhost:7092/api/Driver/GetDrivers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    // Filter out the drivers where teamIdRef matches the teamId from JWT token
    const filteredDrivers = response.data.filter(driver => driver.teamIdRef === parsedTeamId);
    setDriverData(filteredDrivers);
    console.log('Driver data:', filteredDrivers.map(driver => driver.teamIdRef)); // Print teamIdRef values
  })
  .catch((error) => {
    console.error('Error fetching driver data:', error);
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
      navigate('/');
    } else {
      toast.error('An error occurred while fetching driver data');
    }
  });

    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);
  

  const handleManageDriver = (driverId) => {
    // Redirect to the UpdateDriver page with the specific driverId
    navigate(`/UpdateDriverTeam`, { replace: true, state: {driverId } });
  };

  const renderDriverData = () => {
    if (!driverData) {
      return <p>Loading driver data...</p>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>Sl No.</TableCell>
              <TableCell style={{ width: '15%' }}>Driver Name</TableCell>
              <TableCell style={{ width: '10%' }}>Date of Birth</TableCell>
              <TableCell style={{ width: '50%' }}>Description</TableCell>
              <TableCell style={{ width: '20%' }}>Image</TableCell>
              <TableCell style={{ width: '10%' }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {driverData.map((driver, index) => (
              <TableRow key={driver.driverId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{driver.name}</TableCell>
                <TableCell>
                  {new Date(driver.dob).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>{driver.description}</TableCell>
                <TableCell>
                  {driver.imagePath ? (
                    <img
                      src={driver.imagePath}
                      alt={`Image for ${driver.imagePath}`}
                      className="driver-image"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: '150px', height: '150px' }}
                      onLoad={() => console.log(`Image loaded for ${driver.name}: ${driver.imagePath}`)}
                      onError={(e) => {
                        console.error(`Error loading image for ${driver.name}: ${driver.imagePath}`, e);
                        // Optionally, display a default image or a message when an error occurs
                      }}
                    />

                  ) : (
                    <span>No Image</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManageDriver(driver.driverId)}
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
    <div className="driverlistpage">
      <TeamNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="container-fluid">
        <div className="row">
          <TeamSidebar /> {/* Display the TeamSidebar component as a sidebar */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <br />
            {renderDriverData()}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
  
  
};

export default DriverListTeam;
