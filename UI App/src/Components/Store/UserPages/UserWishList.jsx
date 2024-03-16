import React, { useState, useEffect } from 'react';
import UserNavbar from '../../LoginSignup/UserNavbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import jwt_decode from 'jwt-decode';
import './UserWishList.css'; // Import CSS file for styling
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserWishList = () => {
  const [wishListItems, setWishListItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [removeSuccess, setRemoveSuccess] = useState(false); // Track removal success
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishListItems = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Wishlist/GetWishlistByUserId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: userId })
        });
        const data = await response.json();
        setWishListItems(data);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      }
    };

    fetchWishListItems();
  }, [userId, removeSuccess]); // Include removeSuccess in dependency array

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
      await Promise.all(wishListItems.map(item => fetchProductDetails(item.productId)));
    };
  
    fetchAllProductDetails();
  }, [wishListItems]);

  const handleRemoveFromWishList = async (productId) => {
    try {
      const response = await fetch('https://localhost:7092/api/Wishlist/RemoveFromWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productId,
          userId: userId
        })
      });
  
      if (response.ok) {
        // Wishlist item removed successfully
        setRemoveSuccess(true); // Trigger state update
        toast.success('Wishlist item removed successfully.'); // Show success toast
      } else {
        // Handle error
        const errorMessage = await response.text();
        console.error('Failed to remove item from wishlist:', errorMessage);
        toast.error(`Failed to remove item from wishlist: ${errorMessage}`); // Show error toast
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast.error('Error removing item from wishlist.'); // Show error toast
    }
  };

  const handleMoveToCart = async (productId) => {
    const selectedQuantity = 1; // Default quantity
    
    const cartItemData = {
      productId: productId,
      userId: parseInt(userId),
      quantity: selectedQuantity,
      // You may need to adjust the price calculation here based on your backend logic
      price: productDetails[productId]?.price * selectedQuantity,
      timestamp: new Date().toISOString(),
      status: 'inCart',
      size: 'medium'
    };
    
    try {
      const response = await fetch('https://localhost:7092/api/CartItem/MoveWishListToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartItemData)
      });

      console.log("Data Send to Endpoint is ", cartItemData);
  
      if (response.ok) {
        // If successfully moved to cart, remove the wishlist item from state
        setWishListItems(prevItems => prevItems.filter(item => item.productId !== productId));
        toast.success('Item moved to cart successfully.');
      } else {
        console.error('Failed to move item to cart:', response.statusText);
        toast.error('Failed to move item to cart.');
      }
    } catch (error) {
      console.error('Error moving item to cart:', error);
      toast.error('Error moving item to cart.');
    }
  };
  

  useEffect(() => {
    if (removeSuccess) {
      navigate('/UserWishList');
    }
  }, [removeSuccess, navigate]); // Navigate when removeSuccess changes

  return (
    <>
      <UserNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="wishlist-container">
        <div className="user-wishlist-container">
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold' }}>Your WishList</Typography>
          {wishListItems.length === 0 ? (
            <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>Your WishList is Empty</Typography>
          ) : (
            <Grid container spacing={2}>
            {wishListItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.wishListId}>
                <Paper elevation={3} className="wishlist-item">
                  <div className="wishlist-item-content">
                  <a href={`/ProductDetails/${productDetails[item.productId]?.uniqueName}`} className="product-link">
  <img src={`https://localhost:7092/images/${productDetails[item.productId]?.imagePath1}`} alt={productDetails[item.productId]?.productName} className="product-image" />
</a>
  
                  <Typography variant="subtitle1" className="product-name">{productDetails[item.productId]?.productName}</Typography>
                    <Typography variant="body1" className="price">Price: ₹{productDetails[item.productId]?.price}</Typography>
                    <Typography variant="body2" className="stock Quantity">Stock: {productDetails[item.productId]?.stockQuantity}</Typography>
                    <div className="button-container">
                      <Button 
                        className='remove-button-wishlist' 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleRemoveFromWishList(item.productId)}
                      >
                        Remove
                      </Button>
                      {productDetails[item.productId]?.stockQuantity > 0 && ( // Conditionally render the button
                        <Button 
                          className='move-to-cart-button' 
                          variant="contained" 
                          color="primary"
                          onClick={() => handleMoveToCart(item.productId)}
                        >
                          Move to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          )}
        </div>
      </div>
    </>
  );
};

export default UserWishList;
