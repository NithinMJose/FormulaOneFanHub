// TicketPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const TicketPDF = ({ booking }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text>Ticket Booking ID: {booking.ticketBookingId}</Text>
          <Text>Year: {booking.year}</Text>
          <Text>Race Name: {booking.raceName}</Text>
          <Text>Corner Number: {booking.cornerNumber}</Text>
          <Text>Ticket Category: {booking.categoryName}</Text>
          <Text>Number of Tickets Booked: {booking.numberOfTicketsBooked}</Text>
          <Text>Booking Date: {new Date(booking.bookingDate).toLocaleString()}</Text>
          <Text>Total Amount: ${booking.totalAmount}</Text>
          <Text>Payment Status: {booking.paymentStatus}</Text>
          <Text>
            Payment Date: {booking.paymentDate ? new Date(booking.paymentDate).toLocaleString() : '-'}
          </Text>
          <Text>Confirmation Number: {booking.confirmationNumber || '-'}</Text>
          <Text>Booking Status: {booking.bookingStatus}</Text>
          <Text>First Name: {booking.firstName}</Text>
          <Text>Last Name: {booking.lastName}</Text>
          <Text>Address: {booking.address}</Text>
          <Text>Email: {booking.email}</Text>
          <Text>Phone Contact: {booking.phoneContact}</Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default TicketPDF;
