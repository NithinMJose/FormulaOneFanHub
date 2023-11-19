// TBTicket.jsx
import React from 'react';
import { Typography, Paper, Container, Grid, Card, CardContent } from '@mui/material';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';

const TBTicket = ({ data }) => {
  // Replace with actual data received from the confirmation page
  const dummyData = {
    userName: 'Nithin',
    raceName: 'Grand Prix',
    cornerNumber: 'A1',
    categoryName: 'VIP',
    ticketPrice: 100, // Replace with actual ticket price
    numberOfTicketsBooked: 2, // Replace with actual number of tickets booked
  };

  const {
    userName,
    raceName,
    cornerNumber,
    categoryName,
    ticketPrice,
    numberOfTicketsBooked,
  } = data || dummyData;

  return (
    <div>
      <UserNavbar />
      <Container sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Ticket Booked
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {userName}'s Ticket
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Race Name: {raceName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Corner Number: {cornerNumber}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Ticket Category: {categoryName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Ticket Price: ${ticketPrice}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Number of Tickets Booked: {numberOfTicketsBooked}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default TBTicket;
