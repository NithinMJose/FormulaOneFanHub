import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../LoginSignup/UserNavbar';
import './ProductDetails.css';
import jwt_decode from 'jwt-decode';
import Footer from '../../LoginSignup/Footer';
import displayRazorPay from '../../../utils/PaymentGatewayProduct';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [team, setTeam] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false); // State to track description expansion
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`https://localhost:7092/api/User/GetUserDetailsFromUserId?userId=${userId}`);
      const data = await response.json();
      setUserDetails(data);
      console.log("User DetailsZZZZZZZZ :", data);
      console.log('Address:', data.address);
      setNewAddress(data.address);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Product/GetProductByUniqueName?uniqueName=${productId}`);
        const data = await response.json();
        const productId2 = data.productId;
        setProduct(data);

        const count = Object.keys(data).filter(key => key.startsWith('imagePath') && data[key] !== null).length;
        setImageCount(count);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [productId]);


  useEffect(() => {
    const fetchTeam = async () => {
      if (product) {
        try {
          const response = await fetch(`https://localhost:7092/api/Team/GetTeamById?id=${product.teamId}`);
          const data = await response.json();
          setTeam(data);
        } catch (error) {
          console.error('Error fetching team details:', error);
        }
      }
    };

    fetchTeam();
  }, [product]);

  const handlePrevImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex === 0 ? imageCount - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex === imageCount - 1 ? 0 : prevIndex + 1));
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    if (quantity > product.stockQuantity) {
      setError('Selected quantity should not exceed available stock.');
      setTimeout(() => setError(''), 3000);
    } else {
      setError('');
      setSelectedQuantity(quantity);
    }
  };

  const handleAddToCart = async () => {
    const productId2 = product.productId;
    const cartItemData = {
      productId: parseInt(productId2),
      userId: userId,
      quantity: selectedQuantity,
      price: product.price * selectedQuantity,
      timestamp: new Date().toISOString(),
      status: 'inCart',
      size: 'medium'
    };
    try {
      const response = await fetch('https://localhost:7092/api/CartItem/AddToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartItemData)
      });

      if (response.ok) {
        navigate('/UserCart');
      } else {
        console.error('Failed to add item to cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  const handleBuyNow = async () => {
    const discountAmount = 0;
    const orderDate = new Date();
    console.log('Buy now clicked');
    const productId = product.productId;
    const price = product.price;
    const quantity = selectedQuantity;

    console.log("PRODUCT ID", productId);
    console.log("PRICE", price);
    console.log("QUANTITY", quantity);

    const productsToBuy = {
      productId: productId,
      price: price,
      quantity: quantity,
      discountAmount: discountAmount,
      orderDate: orderDate
    };
    console.log("PRODUCTS TO BUY", productsToBuy);

    const dataToTransfer = {
      userId: userId,
      products: productsToBuy
    };
    const totalPrice = (price * quantity) - discountAmount;

    console.log("Just before displayRazorPay")
    console.log("Total Amount:", totalPrice);
    console.log("Data To Tranfer :", dataToTransfer);
    displayRazorPay(totalPrice, dataToTransfer, newAddress, navigate);

  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmEditAddress = () => {
    console.log("New Address:", newAddress);
    setNewAddress(newAddress);
    console.log("New Address:", newAddress);
    setOpenDialog(false);
  };


  return (
    <>
      <UserNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="product-details-container">
        {product && team ? (
          <div className="product-details">
            <div className="product-images-container">
              <div className="product-images">
                <img src={`https://localhost:7092/images/${product[`imagePath${currentImageIndex + 1}`]}`} alt={product.productName} className="main-image" />
              </div>
              <div className="thumbnail-images">
                {Array.from({ length: imageCount }, (_, i) => i + 1).map(index => (
                  <img
                    key={index}
                    src={`https://localhost:7092/images/${product[`imagePath${index}`]}`}
                    alt={product.productName}
                    className={`thumbnail ${index - 1 === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index - 1)}
                  />
                ))}
              </div>
            </div>
            <div className="product-info-container">
              <div className="product-info">
                <h2 className="productNames">{product.productName}</h2>
                <p className="productPrice">₹{product.price}</p>
                {product.stockQuantity === 0 ? (
                  <p className="out-of-stock">Out of Stock</p>
                ) : (
                  <p className="stock-quantity">Stock Available: {product.stockQuantity}</p>
                )}
                {product.stockQuantity > 0 && (
                  <>
                    <div className="quantity-selection">
                      <label htmlFor="quantity" className="quantityHeading">Select Quantity:</label>
                      <input type="number" id="quantity" name="quantity" className="quantityBox" value={selectedQuantity} min="1" max={product.stockQuantity} onChange={handleQuantityChange} />
                      {error && <p className="errorMessage">{error}</p>}
                    </div>
                    <div className="team-details">
                      <hr />
                      <p className="team-genuine">Genuine product from:</p>
                      <div className="team-info">
                        {team.imagePath && <img src={`https://localhost:7092/images/${team.imagePath}`} alt={team.name} className="teamImage" />}
                        <p className="team-name">{team.name}</p>
                      </div>
                    </div>
                    <div className='ProductGenuityText'>
                      <p className="productGenuityTexts3">Assured Benefits !</p>
                      <p className="productGenuityTexts4">Authenticity</p>
                      <p className="productGenuityTexts5">Quality Assurance</p>
                      <p className="productGenuityTexts6">Exclusive Access</p>
                      <hr />
                    </div>
                    <h3 className="description-heading" onClick={() => setExpanded(!expanded)}>Description<span className="plus-symbol">{expanded ? '-' : '+'}</span></h3>
                    {expanded && (
                      <>
                        <p className="product-description">{product.description}</p>
                      </>
                    )}
                    <hr />
                    <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
                  </>
                )}
              </div>
            </div>
            <div className="additionalContainer">
              <div className="inner-content">
                <p className="GrabNowText">Grab Now !</p>
                <p className='addressText'>Shipping Address</p>
                <p className="NewAddressDisplay" style={{ whiteSpace: 'pre-line' }}>{newAddress}</p>
                <p className='totalAmountText'>Total Amount</p>
                <p className="TotalAmountDisplay">₹{product.price * selectedQuantity}</p>
                <button className="edit-address-button" onClick={handleOpenDialog}>Edit Address</button>
                <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
                <p className='ShippingText'>Shipping Details</p>
                <p className="ShippingDetailsDisplay">Free Shipping</p>
                <p className='ReturnText'>Return Policy: 7 Days</p>
                <div className="shipping-info">
                  <p>Your item will be shipped on the next business day after your order and will reach you within 7 days.</p>
                  <p>An authorized delivery person will be contacting you using the contact details provided during checkout.</p>
                </div>
              </div>
          
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="edit-address-dialog-title"
        aria-describedby="edit-address-dialog-description"
      >
        <DialogTitle id="edit-address-dialog-title">Edit Address</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="New Address"
            type="text"
            multiline // Set to true for multi-line input
            fullWidth
            rows={4} // Number of rows for multi-line input
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleCloseDialog} color="primary">
            Cancel
          </button>
          <button onClick={handleConfirmEditAddress} color="primary">
            Confirm
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductDetails;
