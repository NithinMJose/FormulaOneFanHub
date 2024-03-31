import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import axios from 'axios';
import { ThemeProvider, Container, Paper, Typography } from '@mui/material';
import { Toast } from 'bootstrap';

const DirectBuyingFinalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  if (!state || !state.receivedData) {
    // Toast an error message
    navigate('/');
    return null; // or display an error message
  }

  const { receivedData, paymentId, orderId, paymentDate, totalAmount, newAddress } = state;

  console.log('DISPLAYING DATA FROM THE DIRECT BUY FINAL PAGE');
  console.log('Received Data:', receivedData);
  console.log('Payment ID:', paymentId);
  console.log('Order ID:', orderId);
  console.log('Payment Date:', paymentDate);
  console.log('Total Amount:', totalAmount);

  // GetUser Details From receivedData.userId using https://localhost:7092/api/User/GetUserDetailsFromUserId?userId=2
  axios.get(`https://localhost:7092/api/User/GetUserDetailsFromUserId?userId=${receivedData.userId}`)
    .then((response) => {
      console.log('User Details:', response.data);
      const userDetails = response.data;
      const fullName = `${userDetails.firstName} ${userDetails.lastName}`;
      const { email, contactNumber: phoneNumber, address } = userDetails;

      // Calculate shipping date as 13:00 of the next day from the payment date
      const paymentDateTime = new Date(paymentDate);
      const nextDay = new Date(paymentDateTime);
      nextDay.setDate(nextDay.getDate() + 1); // Add one day
      nextDay.setHours(13, 0, 0, 0); // Set time to 13:00
      const shippingDate = nextDay.toISOString(); // Convert to string using the default format
      const paymentDateISO = new Date(paymentDate).toISOString();

      console.log('userId:', receivedData.userId);
      console.log('Full Name', fullName);
      console.log('Email:', email);
      console.log('Phone Number:', phoneNumber);
      console.log('Edited Address:', newAddress);
      console.log('Shipping Date:', shippingDate);
      console.log('Payment ID:', paymentId);
      console.log('Payment Date:', paymentDateISO);
      console.log('Order ID:', orderId);
      console.log('Total Amount:', totalAmount);
      console.log('ProductDetails', receivedData.products);

      // Map each item from receivedData.products and print the details of each product in console
      console.log('Product ID:', receivedData.products.productId);
      console.log('Product Price:', receivedData.products.price);
      console.log('Product Quantity:', receivedData.products.quantity);
      console.log('Total Price:', receivedData.products.price * receivedData.products.quantity);
      console.log('Discount Amount:', receivedData.products.discountAmount);
      console.log('Final Price:', (receivedData.products.price * receivedData.products.quantity) - receivedData.products.discountAmount);

      // Define the request body
      const requestBody = {
        userId: receivedData.userId,
        name: fullName,
        email: email,
        phoneNumber: phoneNumber,
        address: newAddress,
        shippingDate: shippingDate,
        paymentNumberRazor: paymentId,
        paymentDate: paymentDateISO,
        orderIdRazor: orderId,
        orderTotalAmount: totalAmount / 100,
        orderedItemsDto: [
          {
            productId: receivedData.products.productId,
            quantity: receivedData.products.quantity,
            price: receivedData.products.price,
            total: receivedData.products.price * receivedData.products.quantity,
            discountPrice: receivedData.products.discountAmount,
            finalPrice: (receivedData.products.price * receivedData.products.quantity) - receivedData.products.discountAmount,
          }
        ]
      };


      // Print the requestBody in JSON format
      console.log('Request Body in JSON format:', JSON.stringify(requestBody, null, 2));

      var flag = 0;

      if (flag === 0) {
        axios
          .post('https://localhost:7092/api/Order/AddNewOrder', requestBody)
          .then((response) => {
            console.log('Order successfully created:', flag);
            flag = 1;
          })
          .catch((error) => {
            console.error('Error creating order:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  return (
      <div>
        <UserNavbar />
        <br />
        <br />
        <br />
        <br />
        <Container sx={{ marginTop: 4 }}>
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#1976D2' }}>
              Thank You For Shopping With Us!
            </Typography>
          </Paper>
        </Container>
        {/* Display a Go Back To Home Page Button*/}
        <button onClick={() => navigate('/')} style={{ marginLeft: '50%', transform: 'translateX(-50%)' }}>
          Go Back To Home Page
        </button>
        <Footer />
      </div>
  );
};

export default DirectBuyingFinalPage;
