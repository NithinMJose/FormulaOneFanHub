import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../LoginSignup/UserNavbar';
import './ProductDetails.css';
import jwt_decode from 'jwt-decode';
import Footer from '../../LoginSignup/Footer';
import displayRazorPay from '../../../utils/PaymentGatewayProduct';


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
    displayRazorPay(totalPrice, dataToTransfer, navigate);

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
                  <p className="team-genuine">Genuine product from:</p>
                  <div className="team-info">
                    {team.imagePath && <img src={`https://localhost:7092/images/${team.imagePath}`} alt={team.name} className="teamImage" />}
                    <p className="team-name">{team.name}</p>
                  </div>
                </div>
                <h3 className="description-heading" onClick={() => setExpanded(!expanded)}>Description<span className="plus-symbol">{expanded ? '-' : '+'}</span></h3>
                {expanded && (
                  <>
                    <p className="product-description">{product.description}</p>
                  </>
                )}
                <hr />
                <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
                {/*<button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>*/}
              </>
            )}
          </div>
          
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
