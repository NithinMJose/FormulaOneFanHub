import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';
import TeamSidebar from '../sidebar/TeamSidebar';
import Footer from '../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const TeamSellingReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const teamId = decoded.teamId;
  console.log(teamId);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const generateReport = async () => {
    try {
      console.log('Generating report for dates:', startDate, 'to', endDate);
      const response = await axios.get(`https://localhost:7092/api/SoldItem/GetSoldItemHistoryByTeam/${teamId}`);
      console.log("Response is :", response);

      // Filter the response data based on the selected dates
      const filteredItems = response.data.filter(item => {
        const soldDate = new Date(item.soldDate);
        return soldDate >= new Date(startDate) && soldDate <= new Date(endDate);
      });

      // Update state with filtered items
      setFilteredItems(filteredItems);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div>
      <TeamNavbar />
      <div className="container-fluid" style={{ paddingTop: '91px' }}>
        <div className="row">
          <TeamSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Container>
              <Typography variant="h4" gutterBottom>Generate Selling Report</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="start-date"
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="end-date"
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={generateReport}>
                    Generate Report
                  </Button>
                </Grid>
              </Grid>
              <Typography variant="h5" gutterBottom>Selling Report</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price Per Item</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Sold Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredItems.map(item => (
                      <TableRow key={item.soldItemId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.pricePerItem}</TableCell>
                        <TableCell>{item.totalPrice}</TableCell>
                        <TableCell>{new Date(item.soldDate).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeamSellingReport;
