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
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
    },
  },
});

const BuyingFinalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  

  useEffect(() => {
    console.log('DISPLAYING DATA FROM THE FINAL PAGE');
    console.log('Received Data:', state.receivedData);
    console.log('Payment ID:', state.paymentId);
    console.log('Order ID:', state.orderId);
    console.log('Payment Date:', state.paymentDate);
    console.log('Total Amount:', state.totalAmount);
    saveDataToOrderTable(state.receivedData, state.paymentId, state.orderId, state.paymentDate);
  }, [state]);

  const saveDataToOrderTable = (receivedData, paymentId, orderId, paymentDate) => {
    // GetUser Details From receivedData.userId using https://localhost:7092/api/User/GetUserDetailsFromUserId?userId=2
    axios.get(`https://localhost:7092/api/User/GetUserDetailsFromUserId?userId=${receivedData.userId}`)
      .then((response) => {
        console.log('User Details:', response.data);
        const userId = parseInt(receivedData.userId);
        const userDetails = response.data;
        const firstName = userDetails.firstName;
        const lastName = userDetails.lastName;
        const fullName = firstName + ' ' + lastName;
        const email = userDetails.email;
        const phoneNumber = userDetails.contactNumber;
        const address = userDetails.address;
        const totalAmount = state.totalAmount;
  
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
        console.log('Address:', address);
        console.log('Shipping Date:', shippingDate);
        console.log('Payment ID:', paymentId);
        console.log('Payment Date:', paymentDateISO);
        console.log('Order ID:', orderId);
        console.log('Total Amount:', totalAmount);
        console.log('ProductDetails', receivedData.products);
        //Map each item from receivedData.products and print the details of each product in console
        receivedData.products.forEach((product) => {
          console.log('Product ID:', product.productId);
          console.log('Product Price:', product.price);
          console.log('Product Quantity:', product.quantity);
          console.log('Total Price:', product.price * product.quantity);
          console.log('Discount Amount:', product.discountAmount);
          console.log('Final Price:', (product.price * product.quantity) - product.discountAmount);
        });
  
        // Define the request body
        const requestBody = {
          userId: receivedData.userId,
          name: fullName,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
          shippingDate: shippingDate,
          paymentNumberRazor: paymentId,
          paymentDate: paymentDateISO,
          orderIdRazor: orderId,
          orderTotalAmount: (totalAmount/100),
          orderedItemsDto: receivedData.products.map(product => ({
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
            total: product.price * product.quantity,
            discountPrice: product.discountAmount,
            finalPrice: (product.price * product.quantity) - product.discountAmount
          }))
        };
  
        console.log('Request Body:', requestBody);
        
        // Make a POST request to the server
        axios.post('https://localhost:7092/api/Order/AddNewOrder', requestBody)
          .then(response => {
            console.log('Order successfully created:', response.data);
            // You may perform additional actions after successfully saving the order
          })
          .catch(error => {
            console.error('Error creating order:', error);
          });
      })
      .catch((error) => {
        console.log('Error:', error);
      });
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
    </ThemeProvider>
  );
};

export default BuyingFinalPage;
