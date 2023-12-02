import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from '../LoginSignup/UserNavbar';
import useRazorpay from "react-razorpay";
import jwt_decode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid'; // Import uuid library
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
} from '@mui/material';
import Footer from '../LoginSignup/Footer';

const TBConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [confirmationData, setConfirmationData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userName, setUserName] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserName(decodedToken.userName);
    }
  }, [token]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7092/api/User/getUserDetailFromUsername?userName=${userName}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (userName) {
      fetchUserDetails();
    }
  }, [userName]);

  useEffect(() => {
    const fetchConfirmationData = async () => {
      try {
        const response = await axios.post('https://localhost:7092/api/TicketConfirm/ConfirmTickets', {
          seasonId: state.seasonId,
          raceId: state.raceId,
          cornerId: state.cornerId,
          noOfTickets: state.selectedTickets,
          ticketCategoryId: state.ticketCategoryId,
          ticketPrice: state.selectedTickets,
        });
        setConfirmationData(response.data);
        console.log('no.of Tickets:', state.selectedTickets);
        console.log('ticket price:', state.ticketPrice);
      } catch (error) {
        console.error('Error fetching confirmation data:', error);
      }
    };

    if (state && state.seasonId && state.raceId && state.cornerId && state.ticketCategoryId) {
      fetchConfirmationData();
    }
  }, [state]);

  useEffect(() => {
    let total = 1;
    total = state.ticketPrice * state.selectedTickets;
    console.log('Total Amount:', total);
    setTotalAmount(total);
  }, [confirmationData]);

  const handleBookTicket = async () => {
    try {
      if (!userDetails) {
        console.error('User details not available.');
        return;
      }

      // Generate a unique ID for the booking
      const uniqueId = uuidv4();

      // Log the payload before sending the request
      console.log('Booking payload:', {
        UserId: userDetails.id,
        SeasonId: state.seasonId,
        RaceId: state.raceId,
        CornerId: state.cornerId,
        TicketCategoryId: state.ticketCategoryId,
        NumberOfTicketsBooked: state.selectedTickets,
        Email: userDetails.email,
        Address: userDetails.address,
        LastName: userDetails.lastName,
        FirstName: userDetails.firstName,
        PhoneContact: userDetails.contactNumber,
        BookingStatus: 'Confirmed',
        PaymentStatus: 'Pending',
        UniqueId: uniqueId, // Add the unique ID to the payload
      });

      // Send a request to book the ticket
      const response = await axios.post('https://localhost:7092/api/TicketBooking/BookTickets', {
        UniqueId: uniqueId,
        UserId: userDetails.id,
        SeasonId: state.seasonId,
        RaceId: state.raceId,
        CornerId: state.cornerId,
        TicketCategoryId: state.ticketCategoryId,
        NumberOfTicketsBooked: state.selectedTickets,
        Email: userDetails.email,
        Address: userDetails.address,
        LastName: userDetails.lastName,
        FirstName: userDetails.firstName,
        PhoneContact: userDetails.contactNumber,
        TotalAmount: totalAmount,
        BookingStatus: 'Confirmed',
        PaymentStatus: 'Pending',
    });
    
      const ticketBookingId = response.data.TicketBookingId;

      // Log the response from the endpoint
      console.log('Response from the endpoint:', response.data);

      // Navigate to the 'TBTicket' page with the necessary data
      navigate('/TBTicket', {
        state: {
          userName,
          raceName: confirmationData.race?.raceName,
          cornerNumber: confirmationData.corner?.cornerNumber,
          categoryName: confirmationData.ticketCategory?.categoryName,
          ticketPrice: confirmationData.ticketCategory?.ticketPrice,
          numberOfTicketsBooked: state.selectedTickets,
          ticketBookingId: response.data,
        },
      });
    } catch (error) {
      console.error('Error booking ticket:', error);
      // Handle the error
    }
  };

  if (!confirmationData) {
    return <p>No data available for confirmation.</p>;
  }

  return (
    <div>
      <UserNavbar />
      <Container sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Verify Ticket Details
          </Typography>
          <Grid container spacing={2}>
            {/* User Details Container */}
            <Grid item xs={12} md={6}>
              <Card sx={{ marginBottom: 2 }}>
                <CardHeader title="User Details" />
                <CardContent>
                  <Typography variant="body1" paragraph>
                    User Name: {userName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    First Name: {userDetails?.firstName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Last Name: {userDetails?.lastName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Email: {userDetails?.email}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Address: {userDetails?.address}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Phone Contact: {userDetails?.contactNumber}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Booking Details Container */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Booking Details" />
                <CardContent>
                  <Typography variant="body1" paragraph>
                    No. of Tickets Booked: {state.selectedTickets}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Season Year: {confirmationData.season?.year}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Race Name: {confirmationData.race?.raceName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Corner Number: {confirmationData.corner?.cornerNumber}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Ticket Category Name: {confirmationData.ticketCategory?.categoryName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Total Amount: {totalAmount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {confirmationData.ticketCategories && (
            <Grid container spacing={2}>
              {confirmationData.ticketCategories.map((ticketCategory, index) => (
                <Grid item key={index} xs={12} md={6} lg={4}>
                  <Card>
                    <CardHeader title={ticketCategory.categoryName} />
                    <CardContent>
                      <Typography variant="body1" paragraph>
                        Description: {ticketCategory.description}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Ticket Price: {ticketCategory.ticketPrice}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Number of Tickets Booked: {ticketCategory.numberOfTicketsBooked}
                      </Typography>
                    </CardContent>
                    <CardMedia
                      component="img"
                      alt="Ticket Category"
                      height="140"
                      image={`https://localhost:7092/wwwroot/images/${ticketCategory.imagePath}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Button variant="contained" color="primary" onClick={handleBookTicket} sx={{ display: 'block', margin: 'auto' }}>
            Book the Ticket
          </Button>
          <br/>
          
          <Button variant="contained" color="primary" onClick={handleBookTicket} sx={{ display: 'block', margin: 'auto' }}>
            Pay ₹500
          </Button>

        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default TBConfirm;
