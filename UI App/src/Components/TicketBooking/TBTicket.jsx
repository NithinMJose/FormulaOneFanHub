import React, { useEffect, useState } from 'react';
import { Typography, Paper, Container, Grid, Card, CardContent } from '@mui/material';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config';


// ... (previous imports)

const TBTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [ticketDetails, setTicketDetails] = useState(null);
  const [raceDetails, setRaceDetails] = useState(null);
  const [cornerDetails, setCornerDetails] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState(null);

  useEffect(() => {
    console.log('Ticket Booking ID:', state?.ticketBookingId?.ticketBookingId);

    const fetchTicketDetails = async () => {
      try {
        if (state?.ticketBookingId) {
          const response = await axios.get(`${BASE_URL}/api/TicketBooking/GetTicketDetailsById/${state?.ticketBookingId?.ticketBookingId}`);
          setTicketDetails(response.data);
          console.log('Ticket Details:', response.data);

          // Fetch race details using the raceId from the ticket details
          const raceResponse = await axios.get(`${BASE_URL}/api/Race/GetRaceById?id=${response.data.raceId}`);
          setRaceDetails(raceResponse.data);
          console.log('Race Details:', raceResponse.data);

          // Fetch corner details using the cornerId from the ticket details
          const cornerResponse = await axios.get(`${BASE_URL}/api/Corner/GetCornerById?id=${response.data.cornerId}`);
          setCornerDetails(cornerResponse.data);
          console.log('Corner Details:', cornerResponse.data);

          // Fetch category details using the ticketCategoryId from the ticket details
          const categoryResponse = await axios.get(`${BASE_URL}/api/TicketCategory/GetTicketCategoryById?id=${response.data.ticketCategoryId}`);
          setCategoryDetails(categoryResponse.data);
          console.log('Category Details:', categoryResponse.data);

          // Fetch season details using the seasonId from the ticket details
          const seasonResponse = await axios.get(`${BASE_URL}/api/Season/GetSeasonById?id=${response.data.seasonId}`);
          setSeasonDetails(seasonResponse.data);
          console.log('Season Details:', seasonResponse.data);
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      }
    };

    fetchTicketDetails();
  }, [state?.ticketBookingId]);

  useEffect(() => {
    console.log('Season Id from state:', state?.ticketBookingId?.ticketBookingId);
  
    const fetchTicketDetails = async () => {
      try {
        if (state?.ticketBookingId) {
          const response = await axios.get(`${BASE_URL}/api/TicketBooking/GetTicketDetailsById/${state?.ticketBookingId?.ticketBookingId}`);
          setTicketDetails(response.data);
          console.log('Ticket Details:', response.data);

          // Fetch race details using the raceId from the ticket details
          const raceResponse = await axios.get(`${BASE_URL}/api/Race/GetRaceById?id=${response.data.raceId}`);
          setRaceDetails(raceResponse.data);
          console.log('Race Details:', raceResponse.data);

          // Fetch corner details using the cornerId from the ticket details
          const cornerResponse = await axios.get(`${BASE_URL}/api/Corner/GetCornerById?id=${response.data.cornerId}`);
          setCornerDetails(cornerResponse.data);
          console.log('Corner Details:', cornerResponse.data);

          // Fetch category details using the ticketCategoryId from the ticket details
          const categoryResponse = await axios.get(`${BASE_URL}/api/TicketCategory/GetTicketCategoryById?id=${response.data.ticketCategoryId}`);
          setCategoryDetails(categoryResponse.data);
          console.log('Category Details:', categoryResponse.data);

          // Fetch season details using the seasonId from the ticket details
          const seasonResponse = await axios.get(`${BASE_URL}/api/Season/GetSeasonById?id=${response.data.seasonId}`);
          setSeasonDetails(seasonResponse.data);
          console.log('Season Details:', seasonResponse.data);
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      }
    };
  
    fetchTicketDetails();
  }, [state?.ticketBookingId, state?.seasonId]);

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
                    {ticketDetails?.firstName} {ticketDetails?.lastName}'s Ticket
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Race Season Year: {seasonDetails?.year || ticketDetails?.seasonId}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Race Name: {raceDetails?.raceName || ticketDetails?.raceId}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Corner Number: {cornerDetails?.cornerNumber || ticketDetails?.cornerId}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Ticket Category: {categoryDetails?.categoryName || ticketDetails?.ticketCategoryId}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Ticket Price: ${ticketDetails?.totalAmount}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Number of Tickets Booked: {ticketDetails?.numberOfTicketsBooked}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Booking Id: {ticketDetails?.ticketBookingId}
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
