import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import jwt_decode from 'jwt-decode';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';
import TeamSidebar from '../sidebar/TeamSidebar';
import Footer from '../LoginSignup/Footer';

const TeamSellingHistory = () => {
  const [sellingHistory, setSellingHistory] = useState([]);
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const teamId = decoded.teamId;
  console.log(teamId);

  useEffect(() => {
    fetchSellingHistory();
  }, []);

  const fetchSellingHistory = async () => {
    try {
      const response = await axios.get(`https://localhost:7092/api/SoldItem/GetSoldItemHistoryByTeam/${teamId}`);
      setSellingHistory(response.data);
    } catch (error) {
      console.error('Error fetching selling history:', error);
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
              <Typography variant="h4" gutterBottom>Team Selling History</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price Per Item</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Sold Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sellingHistory.map(item => (
                      <TableRow key={item.soldItemId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.pricePerItem}</TableCell>
                        <TableCell>{item.totalPrice}</TableCell>
                        <TableCell>{new Date(item.soldDate).toLocaleString()}</TableCell>
                        <TableCell>{item.status}</TableCell>
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

export default TeamSellingHistory;
