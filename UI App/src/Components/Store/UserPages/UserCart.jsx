import React, { useState, useEffect } from 'react';
import UserNavbar from '../../LoginSignup/UserNavbars';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import jwt_decode from 'jwt-decode';
import './UserCart.css'; // Import CSS file for styling

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/CartItem/GetCartItemsByUserId/${userId}`);
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    const fetchProductDetails = async (productId) => {
      try {
        const response = await fetch(`https://localhost:7092/api/Product/GetProductById?id=${productId}`);
        const data = await response.json();
        setProductDetails(prevState => ({
          ...prevState,
          [productId]: data
        }));
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
  
    const fetchAllProductDetails = async () => {
      await Promise.all(cartItems.map(item => fetchProductDetails(item.productId)));
    };
  
    fetchAllProductDetails();
  }, [cartItems]);

  // Group cart items by product ID
  const groupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.productId]) {
      acc[item.productId] = { ...item, quantity: 0, totalPrice: 0 };
    }
    acc[item.productId].quantity += item.quantity;
    acc[item.productId].totalPrice += item.price;
    return acc;
  }, {});

  return (
    <>
      <UserNavbar />
      <div className="cart-container">
        <div className="user-cart-container">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold' }}>Your Cart</Typography>
          <Grid container spacing={2}>
            {Object.values(groupedCartItems).map((item, index) => (
              <Grid item xs={12} key={item.productId}>
                <Paper elevation={3} className="cart-item">
                  <div className="cart-item-content">
                    <div className="image-container">
                      <img src={`https://localhost:7092/images/${productDetails[item.productId]?.imagePath1}`} alt={productDetails[item.productId]?.productName} className="product-image" />
                    </div>
                    <div className="details-container">
                    <Typography variant="subtitle1" className="product-name" style={{ fontSize: '24px', fontWeight: 'bold' }}>{productDetails[item.productId]?.productName}</Typography>
                      <div className="quantity-price">
                        <Typography variant="body1">Quantity: {item.quantity}</Typography>
                        <Typography variant="body1" className="price" style={{ fontSize: '18px', fontWeight: 'bold' }}>Price: ₹{item.totalPrice.toFixed(2)}</Typography>
                      </div>
                      <Button className='remove-button-cart' variant="contained" color="primary">Remove</Button>
                    </div>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
        <div className="details-summary">
          <Paper elevation={3} className="summary-container">
          <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>Price Details</Typography>
            {Object.values(groupedCartItems).map((item, index) => (
              <div key={item.productId} className="price-detail">
                <Typography variant="subtitle1">{productDetails[item.productId]?.productName} x {item.quantity}</Typography>
                <Typography variant="body1" className="price">₹{item.totalPrice.toFixed(2)}</Typography>
              </div>
            ))}
            <div className="total-amount">
              <Typography variant="subtitle1">Total Amount:</Typography>
              <Typography variant="h6">₹{Object.values(groupedCartItems).reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2)}</Typography>
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default UserCart;
