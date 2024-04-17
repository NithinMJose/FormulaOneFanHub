import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from '../LoginSignup/UserNavbar';
import CourseCard from '../CourseCard';
import displayRazorPay from "../../utils/PaymentGateway";
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
import { set } from 'react-hook-form';
import { BASE_URL } from '../../config';

const TBConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [confirmationData, setConfirmationData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userName, setUserName] = useState('');
  const [seasonYear, setSeasonYear] = useState('');
  const [raceName, setRaceName] = useState('');
  const [raceId, setRaceId] = useState('');
  const [cornerNumber, setCornerNumber] = useState('');
  const [ticketCategoryName, setTicketCategoryName] = useState('');
  const [seasonId, setSeasonId] = useState('');
  const [cornerId, setCornerId] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const token = localStorage.getItem('jwtToken');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserName(decodedToken.userName);
      console.log('User Name:', decodedToken.userName);
      const cornerId = state.cornerId;
      const selectedTickets = state.selectedTickets;
      const ticketCategoryId = state.ticketCategoryId;
      const ticketPrice = state.ticketPrice;
      const totalAmount = selectedTickets * ticketPrice;
      console.log('Corner Id', cornerId, 'Selected Tickets', selectedTickets, 'Ticket Category Id', ticketCategoryId, 'Ticket Price', ticketPrice, 'Total Amount', totalAmount);
  
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/Corner/GetDetailsFromCornerId?cornerId=${cornerId}&ticketCategoryId=${ticketCategoryId}`);
          setConfirmationData(response.data); // Set the response data to state
          const cornerNumber = response.data.cornerNumber;
          setCornerNumber(cornerNumber);
          const raceName = response.data.raceName;
          setRaceName(raceName);
          const seasonYear = response.data.seasonYear; 
          setSeasonYear(seasonYear);
          const ticketCategoryName = response.data.ticketCategoryName;
          setTicketCategoryName(ticketCategoryName);
          const raceId = response.data.raceId;
          setRaceId(raceId);
          const seasonId = response.data.seasonId;
          setSeasonId(seasonId);
          console.log('Corner Number',cornerNumber, 'raceName', raceName, 'seasonYear', seasonYear, 'ticketCategoryName', ticketCategoryName, 'raceId', raceId, 'seasonId', seasonId);
        } catch (error) {
          console.error('Error fetching confirmation data:', error);
        }
  
        try {
          const response = await axios.get(`${BASE_URL}/api/User/getUserDetailFromUsername?userName=${decodedToken.userName}`);
          setUserDetails(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
      fetchData(); // Call the async function to execute the requests
    }
  }, [token]);
  

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/User/getUserDetailFromUsername?userName=${userName}`);
        setUserDetails(response.data);
        console.log(response.data);
        console.log('fetchUserDetails has been called');
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
        const response = await axios.post(`${BASE_URL}/api/TicketConfirm/ConfirmTickets`, {
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



  const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");

        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script);
    })

}
useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
})


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
      const response = await axios.post(`${BASE_URL}/api/TicketBooking/BookTickets`, {
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

  const handlePayment = async () => {
    try {
      // Replace with your backend API endpoint for creating Razorpay order
      const response = await axios.post(`${BASE_URL}/api/Razor/order`, {
        amount: 100,
        currency: 'INR',
        receipt: '12121',
      });

      // Extract the order ID from the response
      const { orderId } = response.data;

      // Set the order ID in the component state
      setOrderId(orderId);

      // Now, you can use this orderId to initiate the Razorpay payment on the frontend
      // Implement Razorpay payment logic here
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
    }
  };

  const dataToTranfer = {
    UserName: userName,
    FirstName: userDetails?.firstName,
    LastName: userDetails?.lastName,
    Email: userDetails?.email,
    Address: userDetails?.address,
    PhoneContact: userDetails?.contactNumber,
    NoOfTickets: state.selectedTickets,
    SeasonYear: seasonYear,
    RaceName: raceName,
    CornerNumber: cornerNumber,
    TicketCategoryName: ticketCategoryName,
    TotalAmount: totalAmount,
    UserId: userDetails?.id,
    RaceId: raceId,
    CornerId: state.cornerId,
    TicketCategoryId: state.ticketCategoryId,
    SeasonId: seasonId,
        
  };
  

  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <br />
      <br />
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
                    Season Year: {seasonYear}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Race Name: {raceName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Corner Number: {cornerNumber}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Ticket Category Name: {ticketCategoryName}
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
                      image={`${BASE_URL}/wwwroot/images/${ticketCategory.imagePath}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <br/>
          <Button variant="contained" color="secondary" onClick={() => displayRazorPay(totalAmount, userDetails?.contactNumber, dataToTranfer, navigate)} sx={{ display: 'block', margin: 'auto' }}>
            Go to Payment
          </Button>
          <br/>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default TBConfirm;
