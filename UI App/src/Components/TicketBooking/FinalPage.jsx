import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
    },
  },
});

const FinalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    console.log('FinalPage state:', state);
    saveDataToDatabase(state.receivedData, state.paymentId, state.orderId);
  }, [state]);

  const saveDataToDatabase = async (receivedData, paymentId, orderId) => {
    try {
      console.log('Trying to save data to the database...');
      console.log('Received Data:', receivedData);
  
      const response1 = await fetch('https://localhost:7092/api/Corner/GetSeasonIdAndRaceIdByCornerId?cornerId=' + receivedData.CornerId);
      if (!response1.ok) {
        throw new Error('Failed to fetch season and race data');
      }
      
      const data = await response1.json();
      console.log('Fetched SeasonId and RaceId:', data);
  
      const response = await fetch('https://localhost:7092/api/TicketBooking/TBDBSave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueId: orderId,
          receiptNumber: state.orderId,
          userId: receivedData.UserId,
          seasonId: data.seasonId,
          raceId: data.raceId,
          cornerId: receivedData.CornerId,
          ticketCategoryId: receivedData.TicketCategoryId,
          numberOfTicketsBooked: receivedData.NoOfTickets,
          totalAmount: receivedData.TotalAmount,
          confirmationNumber: state.paymentId,
          firstName: receivedData.FirstName,
          lastName: receivedData.LastName,
          address: receivedData.Address,
          email: receivedData.Email,
          phoneContact: receivedData.PhoneContact,
        }),
      });
  
      if (response.ok) {
        console.log('Data saved to the database successfully.');
      } else {
        console.log('Unique ID :', orderId );
        console.log('receiptNumber :', state.orderId );
        console.log('userId', receivedData.UserId );
        console.log('seasonId', data.seasonId );
        console.log('raceId', data.raceId );
        console.log('cornerId', receivedData.CornerId );
        console.log('ticketCategoryId', receivedData.TicketCategoryId );
        console.log('numberOfTicketsBooked', receivedData.NoOfTickets );
        console.log('totalAmount', receivedData.TotalAmount );
        console.log('confirmationNumber', state.paymentId );
        console.log('firstName', receivedData.FirstName );
        console.log('lastName', receivedData.LastName );
        console.log('address', receivedData.Address );
        console.log('email', receivedData.Email );
        console.log('phoneContact', receivedData.PhoneContact );
        console.error('Failed to save data to the database.');
      }
    } catch (error) {
      console.error('Error saving data to the database:', error);
    }
  };
  
  

  return (
    <ThemeProvider theme={theme}>
      <div>
        <UserNavbar />
        <br />
        <br />
        <br />
        <br />
        <Container sx={{ marginTop: 4 }}>
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#1976D2' }}>
              Thank You For Booking Tickets
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      User Name: {state.receivedData.UserName}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      First Name: {state.receivedData.FirstName}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Last Name: {state.receivedData.LastName}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Email: {state.receivedData.Email}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Address: {state.receivedData.Address}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Contact Number: {state.receivedData.PhoneContact}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Payment ID: {state.paymentId}
                    </Typography>
                    <Typography variant="h6" gutterBottom color="primary">
                      Order ID: {state.orderId}
                    </Typography>
                    <Typography variant="h6" gutterBottom color="primary">
                      No of Tickets: {state.receivedData.NoOfTickets}
                    </Typography>
                    <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                      Total Amount: {state.receivedData.TotalAmount}
                    </Typography>
                    <Typography variant="h6" gutterBottom color="primary">
                      Payment Status: Paid
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Container>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default FinalPage;
