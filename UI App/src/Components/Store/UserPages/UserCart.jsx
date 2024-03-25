import React, { useState, useEffect } from 'react';
import UserNavbar from '../../LoginSignup/UserNavbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import jwt_decode from 'jwt-decode';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from 'react-router-dom';
import './UserCart.css';
import displayRazorPay from '../../../utils/PaymentGatewayDirectBuy';
import Footer from '../../LoginSignup/Footer';

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [cartItemIdToRemove, setCartItemIdToRemove] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/CartItem/GetCartItemsByUserId/${userId}`);
        const data = await response.json();
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
      await fetch(`https://localhost:7092/api/CartItem/DeleteFromCartById`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItemId: cartItemId,
          status: 'inactive'
        })
      });
      const response = await fetch(`https://localhost:7092/api/CartItem/GetCartItemsByUserId/${userId}`);
      const data = await response.json();
      const activeItems = data.filter(item => item.status === "active");
      setCartItems(activeItems);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleQuantityChange = (event, cartItemId) => {
    const inputValue = parseInt(event.target.value);
    const availableStock = productDetails[cartItems.find(item => item.cartItemId === cartItemId)?.productId]?.stockQuantity;
    
    if (!isNaN(inputValue) && inputValue > 0 && inputValue <= availableStock) {
      const updatedCartItems = cartItems.map(item => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: inputValue
          };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    }
  };

  const handleOpenDialog = (cartItemId) => {
    setCartItemIdToRemove(cartItemId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getSubtotal = (item) => {
    return item.quantity * productDetails[item.productId]?.price;
  };

  const getTotalAmount = () => {
    return cartItems.reduce((acc, item) => acc + getSubtotal(item), 0);
  };

  const handleProductDetailClick = async (productId) => {
    try {
      // Convert productId into UniqueName from database
      console.log("productId :", productId);
      const resp = await fetch(`https://localhost:7092/api/Product/GetProductById?id=${productId}`);
      if (!resp.ok) {
        throw new Error('Failed to fetch product details');
      }
      const productData = await resp.json(); // Extract JSON data from response
      console.log("response :", productData);
      const uniqueName = productData.uniqueName;
  
      navigate(`/ProductDetails/${uniqueName}`);
    } catch (error) {
      console.error('Error fetching product details:', error);
      // Handle error, perhaps show a message to the user
    }
  };
  

  const handleBuyNow = () => {
    const discountAmount = 0;
    const orderDate = new Date();
    console.log("Buy Now Clicked");


    const productsToBuy = cartItems.map(item => ({
      productId: item.productId,
      price: productDetails[item.productId]?.price,
      quantity: item.quantity,
      discountAmount: discountAmount,
      orderDate: orderDate,
    }));
  
    const dataToTransfer = {
      userId: userId,
      products: productsToBuy,
    };
    console.log("Just before displayRazorPay")
    console.log("Total Amount:", getTotalAmount());
    console.log("Data To Tranfer :", dataToTransfer);
    displayRazorPay(getTotalAmount(), dataToTransfer, navigate);

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
                        <img
                          src={`https://localhost:7092/images/${productDetails[item.productId]?.imagePath1}`}
                          alt={productDetails[item.productId]?.productName}
                          className="product-image"
                          onClick={() => handleProductDetailClick(item.productId)}
                        />
                      </div>
                      <div className="details-container">
                        <Typography variant="subtitle1" className="product-name" style={{ fontSize: '24px', fontWeight: 'bold' }}>{productDetails[item.productId]?.productName}</Typography>
                        <div className="quantity-price">
                          <Typography variant="body1">Available Stock: {productDetails[item.productId]?.stockQuantity}</Typography>
                          <div className="quantity-container">
                            <Typography variant="body1" style={{ marginRight: '10px' }}>Quantity:</Typography>
                            <input 
                              type="number"
                              className="quantity-input custom-input"
                              value={item.quantity}
                              onChange={(event) => handleQuantityChange(event, item.cartItemId)}
                            />
                          </div>
                          <Typography variant="body1" className="price" style={{ fontSize: '18px', fontWeight: 'bold' }}>Price: ₹{productDetails[item.productId]?.price}</Typography>
                        </div>
                        <Button 
                          className='remove-button-cart' 
                          variant="contained" 
                          color="primary"
                          onClick={() => handleOpenDialog(item.cartItemId)}
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
                <Typography variant="body1" className="price">₹{getSubtotal(item).toFixed(2)}</Typography>
              </div>
            ))}
            <div className="total-amount">
              <Typography variant="subtitle1">Total Amount:</Typography>
              <Typography variant="h6">₹{getTotalAmount().toFixed(2)}</Typography>
            </div>
            <br />
            <div 
              className='buyNowButton'
              onClick={handleBuyNow}
            >
              Buy Now
            </div>
          </Paper>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to remove this item from the cart?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleRemoveFromCart(cartItemIdToRemove)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
};

export default UserCart;
