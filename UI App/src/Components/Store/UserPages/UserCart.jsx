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
        // Filter out items with "inactive" status
        const activeItems = data.filter(item => item.status === "active");
        setCartItems(activeItems);
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

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await fetch(`https://localhost:7092/api/CartItem/UpdateCartItemStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItemId: cartItemId,
          status: 'inactive'
        })
      });
      // After removing, fetch updated cart items
      const response = await fetch(`https://localhost:7092/api/CartItem/GetCartItemsByUserId/${userId}`);
      const data = await response.json();
      const activeItems = data.filter(item => item.status === "active");
      setCartItems(activeItems);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  return (
    <>
      <UserNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="cart-container">
        <div className="user-cart-container">
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold' }}>Your Cart</Typography>
          {cartItems.length === 0 ? (
            <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>Your Cart is Empty</Typography>
          ) : (
            <Grid container spacing={2}>
              {cartItems.map((item, index) => (
                <Grid item xs={12} key={item.cartItemId}>
                  <Paper elevation={3} className="cart-item">
                    <div className="cart-item-content">
                      <div className="image-container">
                        <img src={`https://localhost:7092/images/${productDetails[item.productId]?.imagePath1}`} alt={productDetails[item.productId]?.productName} className="product-image" />
                      </div>
                      <div className="details-container">
                        <Typography variant="subtitle1" className="product-name" style={{ fontSize: '24px', fontWeight: 'bold' }}>{productDetails[item.productId]?.productName}</Typography>
                        <div className="quantity-price">
                          <Typography variant="body1">Available Stock: {productDetails[item.productId]?.stockQuantity}</Typography>
                          <Typography variant="body1">Quantity: {item.quantity}</Typography>
                          <Typography variant="body1" className="price" style={{ fontSize: '18px', fontWeight: 'bold' }}>Price: ₹{productDetails[item.productId]?.price}</Typography>
                        </div>
                        <Button 
                          className='remove-button-cart' 
                          variant="contained" 
                          color="primary"
                          onClick={() => handleRemoveFromCart(item.cartItemId)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
        <div className="details-summary">
          <Paper elevation={3} className="summary-container">
            <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>Price Details</Typography>
            {cartItems.map((item, index) => (
              <div key={item.cartItemId} className="price-detail">
                <Typography variant="subtitle1">{productDetails[item.productId]?.productName} x {item.quantity}</Typography>
                <Typography variant="body1" className="price">₹{item.price.toFixed(2)}</Typography>
              </div>
            ))}
            <div className="total-amount">
              <Typography variant="subtitle1">Total Amount:</Typography>
              <Typography variant="h6">₹{cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</Typography>
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default UserCart;
