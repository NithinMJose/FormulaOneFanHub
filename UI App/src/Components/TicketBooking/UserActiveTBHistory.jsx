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
} from '@mui/material';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import { useNavigate } from 'react-router-dom';

const UserActiveTBHistory = () => {
  const [activeTicketBookingHistory, setActiveTicketBookingHistory] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const [userIdDecode, setUserId] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  useEffect(() => {
    const fetchActiveTicketBookingHistory = async () => {
      try {
        const decodedToken = jwt_decode(token);
        const response = await axios.get(`https://localhost:7092/api/TicketBooking/GetTicketBookingHistoryByUserId/${decodedToken.userId}`);
        const enhancedHistory = await Promise.all(
          response.data.map(async (booking) => {
            try {
              const raceResponse = await axios.get(`https://localhost:7092/api/Race/GetRaceById?id=${booking.raceId}`);
              const cornerResponse = await axios.get(`https://localhost:7092/api/Corner/GetCornerById?id=${booking.cornerId}`);
              const categoryResponse = await axios.get(`https://localhost:7092/api/TicketCategory/GetTicketCategoryById?id=${booking.ticketCategoryId}`);
              const seasonResponse = await axios.get(`https://localhost:7092/api/Season/GetSeasonById?id=${booking.seasonId}`);
              
              // Check if the raceDate is a future date
              const isFutureDate = new Date(raceResponse.data.raceDate) > new Date();

              if (isFutureDate) {
                return {
                  ...booking,
                  year: seasonResponse.data?.year,
                  cornerNumber: cornerResponse.data?.cornerNumber,
                  categoryName: categoryResponse.data?.categoryName,
                  raceName: raceResponse.data?.raceName,
                  raceDate: raceResponse.data?.raceDate,
                  // Add any additional properties you need
                };
              } else {
                return null;
              }
            } catch (error) {
              console.error('Error fetching additional details:', error);
              return booking;
            }
          })
        );

        // Remove null entries (bookings for past races)
        const filteredHistory = enhancedHistory.filter(booking => booking !== null);

        filteredHistory.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setActiveTicketBookingHistory(filteredHistory);
      } catch (error) {
        console.error('Error fetching active ticket booking history:', error);
      }
    };

    fetchActiveTicketBookingHistory();
  }, []);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const handlePrintTicket = (booking) => {
    alert(`Printing the ticket for Booking ID: ${booking.ticketBookingId}`);
  };

  const handleManageBooking = async (booking) => {
    if (booking.bookingStatus === 'Confirmed') {
      try {
        // Make an API call to cancel the booking
        await axios.patch(`https://localhost:7092/api/TicketBooking/CancelTicketById/${booking.ticketBookingId}`);
        
        // Make an API call to update the corner seats
        console.log('CorenerId :', booking.cornerId)
        console.log('seatsToIncrease', booking.seatsToIncrease)
        await axios.put(`https://localhost:7092/api/Corner/UpdateCornerSeatByTicketCancel`, {
          cornerId: booking.cornerId,
          seatsToIncrease: booking.numberOfTicketsBooked,
        });

        // Update the local state or fetch the updated data
        // (You may want to refetch the active ticket booking history or update the state)
        // For simplicity, let's just show an alert
        alert(`Booking for Booking ID: ${booking.ticketBookingId} has been successfully cancelled.`);
        navigate('/UserActiveTBHistory')
      } catch (error) {
        console.error('Error managing booking:', error);
        alert('Error managing the booking. Please try again.');
      }
    } else if (booking.bookingStatus === 'Cancelled') {
      // Handle cancelled logic (optional)
      alert(`This booking is already cancelled for Booking ID: ${booking.ticketBookingId}`);
    }
  };

  return (
    <div>
      <UserNavbar />
      <Container sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Active Ticket Booking History
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sl No</TableCell>
                  <TableCell>Race Name</TableCell>
                  <TableCell>Race Date</TableCell>
                  <TableCell>Ticket Status</TableCell>
                  <TableCell>Manage</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeTicketBookingHistory.map((booking, index) => (
                  <TableRow key={booking.ticketBookingId} onClick={() => handleViewDetails(booking)}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.raceName}</TableCell>
                    <TableCell>{new Date(booking.raceDate).toLocaleString()}</TableCell>
                    <TableCell>{booking.bookingStatus}</TableCell>
                    <TableCell>
                      {booking.bookingStatus === 'Confirmed' && (
                        <Button variant="outlined" onClick={() => handleManageBooking(booking)}>
                          Cancel
                        </Button>
                      )}
                      {booking.bookingStatus === 'Cancelled' && (
                        <Button variant="outlined" disabled>
                          Cancelled
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Footer />


      

      <Dialog open={detailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>Booking Details</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Secured Ticket ID</TableCell>
                  <TableCell>{selectedBooking?.uniqueId || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>{selectedBooking?.year}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Race Name</TableCell>
                  <TableCell>{selectedBooking?.raceName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Corner Number</TableCell>
                  <TableCell>{selectedBooking?.cornerNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ticket Category</TableCell>
                  <TableCell>{selectedBooking?.categoryName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Number of Tickets Booked</TableCell>
                  <TableCell>{selectedBooking?.numberOfTicketsBooked}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>{new Date(selectedBooking?.bookingDate).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>${selectedBooking?.totalAmount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>{selectedBooking?.paymentStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>
                    {selectedBooking?.paymentDate ? new Date(selectedBooking?.paymentDate).toLocaleString() : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Confirmation Number</TableCell>
                  <TableCell>{selectedBooking?.confirmationNumber || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Booking Status</TableCell>
                  <TableCell>{selectedBooking?.bookingStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>{selectedBooking?.firstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Name</TableCell>
                  <TableCell>{selectedBooking?.lastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>{selectedBooking?.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>{selectedBooking?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Phone Contact</TableCell>
                  <TableCell>{selectedBooking?.phoneContact}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <DialogActions sx={{ justifyContent: 'center' }}>
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

export default UserActiveTBHistory;
