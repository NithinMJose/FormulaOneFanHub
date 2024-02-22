import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import UserNavbar from '../../LoginSignup/UserNavbars';
import './ProductDetails.css'; // Import CSS file for styling
// get the user id from the jwt token
import jwt_decode from 'jwt-decode';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [team, setTeam] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [error, setError] = useState('');
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;
  const navigate = useNavigate(); // Get navigate function

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Product/GetProductById?id=${productId}`);
        const data = await response.json();
        setProduct(data);

        // Count the number of image paths that are not null
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
      setError('Quantity selected exceeds available stock.');
    } else {
      setError('');
      setSelectedQuantity(quantity);
    }
  };

  const handleAddToCart = async () => {
    // Prepare the cart item data
    const cartItemData = {
      productId: parseInt(productId),
      userId: userId,
      quantity: selectedQuantity,
      price: product.price * selectedQuantity,
      timestamp: new Date().toISOString(),
      status: 'inCart',
      size: 'medium'
    };

    try {
      // Make a POST request to add the item to the cart
      const response = await fetch('https://localhost:7092/api/CartItem/AddToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartItemData)
      });

      if (response.ok) {
        // If the item is successfully added to the cart, navigate to '/UserCart'
        navigate('/UserCart');
      } else {
        console.error('Failed to add item to cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="product-details-container">
        <h1 className="page-title">Product Details</h1>
        {product && team ? (
          <div className="product-details">
            <div className="product-images">
              <img src={`https://localhost:7092/images/${product[`imagePath${currentImageIndex + 1}`]}`} alt={product.productName} className="main-image" />
              <button className="prev-button" onClick={handlePrevImage}>{'<'}</button>
              <button className="next-button" onClick={handleNextImage}>{'>'}</button>
            </div>
            <div className="product-info">
              <h2 className="product-name">{product.productName}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
              <p className="stock-quantity">Stock Quantity: {product.stockQuantity}</p>
              <div className="quantity-selection">
                <label htmlFor="quantity">Select Quantity:</label>
                <input type="number" id="quantity" name="quantity" value={selectedQuantity} min="1" max={product.stockQuantity} onChange={handleQuantityChange} />
                {error && <p className="error-message">{error}</p>}
              </div>
              <div className="team-details">
                <p className="team-genuine">Genuine product from:</p>
                <div className="team-info">
                  {team.imagePath && <img src={`https://localhost:7092/images/${team.imagePath}`} alt={team.name} className="team-image" />}
                  <p className="team-name">{team.name}</p>
                </div>
              </div>
              <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
