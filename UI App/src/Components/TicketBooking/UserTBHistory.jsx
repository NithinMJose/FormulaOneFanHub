import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const UserTBHistory = () => {
  const [ticketBookingHistory, setTicketBookingHistory] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const [userIdDecode, setUserId] = useState('');

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  useEffect(() => {
    const fetchTicketBookingHistory = async () => {
      try {
        const decodedToken = jwt_decode(token);
        const response = await axios.get(`https://localhost:7092/api/TicketBooking/GetTicketBookingHistoryByUserId/${decodedToken.userId}`);
        const enhancedHistory = await Promise.all(
          response.data.map(async (booking) => {
            try {
              // Fetch additional details for each field
              const seasonResponse = await axios.get(`https://localhost:7092/api/Season/GetSeasonById?id=${booking.seasonId}`);
              const raceResponse = await axios.get(`https://localhost:7092/api/Race/GetRaceById?id=${booking.raceId}`);
              const cornerResponse = await axios.get(`https://localhost:7092/api/Corner/GetCornerById?id=${booking.cornerId}`);
              const categoryResponse = await axios.get(`https://localhost:7092/api/TicketCategory/GetTicketCategoryById?id=${booking.ticketCategoryId}`);

              // Return the booking with additional details
              return {
                ...booking,
                year: seasonResponse.data?.year,
                raceName: raceResponse.data?.raceName,
                cornerNumber: cornerResponse.data?.cornerNumber,
                categoryName: categoryResponse.data?.categoryName,
              };
            } catch (error) {
              console.error('Error fetching additional details:', error);
              return booking; // Return the original booking in case of an error
            }
          })
        );

        // Sort the history based on booking date
        enhancedHistory.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

        setTicketBookingHistory(enhancedHistory);
      } catch (error) {
        console.error('Error fetching ticket booking history:', error);
      }
    };

    fetchTicketBookingHistory();
  }, []);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const handlePrintTicket = (booking) => {
    // Add your logic for printing the ticket here
    alert(`Printing the ticket for Booking ID: ${booking.ticketBookingId}`);
  };

  return (
    <div>
      <UserNavbar />
      <Container sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Ticket Booking History
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sl No</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Race Name</TableCell>
                  <TableCell>Number of Tickets</TableCell>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ticketBookingHistory.map((booking, index) => (
                  <TableRow key={booking.ticketBookingId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.year}</TableCell>
                    <TableCell>{booking.raceName}</TableCell>
                    <TableCell>{booking.numberOfTicketsBooked}</TableCell>
                    <TableCell>{new Date(booking.bookingDate).toLocaleString()}</TableCell>
                    <TableCell>{booking.paymentStatus}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleViewDetails(booking)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Footer />

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>Booking Details</DialogTitle>
        <DialogContent>


        
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6" gutterBottom>
          Ticket Booking ID:
        </Typography>
        <Typography>
          <strong>Year:</strong>
        </Typography>
        <Typography>
          <strong>Race Name:</strong>
        </Typography>
        <Typography>
          <strong>Corner Number:</strong>
        </Typography>
        <Typography>
          <strong>Ticket Category:</strong>
        </Typography>
        <Typography>
          <strong>Number of Tickets Booked:</strong>
        </Typography>
        <Typography>
          <strong>Booking Date:</strong>
        </Typography>
        <Typography>
          <strong>Total Amount:</strong>
        </Typography>
        <Typography>
          <strong>Payment Status:</strong>
        </Typography>
        <Typography>
          <strong>Payment Date:</strong>
        </Typography>
        <Typography>
          <strong>Confirmation Number:</strong>
        </Typography>
        <Typography>
          <strong>Booking Status:</strong>
        </Typography>
        <Typography>
          <strong>First Name:</strong>
        </Typography>
        <Typography>
          <strong>Last Name:</strong>
        </Typography>
        <Typography>
          <strong>Address:</strong>
        </Typography>
        <Typography>
          <strong>Email:</strong>
        </Typography>
        <Typography>
          <strong>Phone Contact:</strong>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" gutterBottom>
          {selectedBooking?.ticketBookingId}
        </Typography>
        <Typography>{selectedBooking?.year}</Typography>
        <Typography>{selectedBooking?.raceName}</Typography>
        <Typography>{selectedBooking?.cornerNumber}</Typography>
        <Typography>{selectedBooking?.categoryName}</Typography>
        <Typography>{selectedBooking?.numberOfTicketsBooked}</Typography>
        <Typography>{new Date(selectedBooking?.bookingDate).toLocaleString()}</Typography>
        <Typography>${selectedBooking?.totalAmount}</Typography>
        <Typography>{selectedBooking?.paymentStatus}</Typography>
        <Typography>
          {selectedBooking?.paymentDate ? new Date(selectedBooking?.paymentDate).toLocaleString() : '-'}
        </Typography>
        <Typography>{selectedBooking?.confirmationNumber || '-'}</Typography>
        <Typography>{selectedBooking?.bookingStatus}</Typography>
        <Typography>{selectedBooking?.firstName}</Typography>
        <Typography>{selectedBooking?.lastName}</Typography>
        <Typography>{selectedBooking?.address}</Typography>
        <Typography>{selectedBooking?.email}</Typography>
        <Typography>{selectedBooking?.phoneContact}</Typography>
      </Grid>
    </Grid>
    <DialogActions sx={{ justifyContent: 'center' }}>
    <br />
            <Button variant="outlined" color="primary" onClick={() => handlePrintTicket(selectedBooking)}>
              Print the Ticket
            </Button>
          </DialogActions>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTBHistory;
