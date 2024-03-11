import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserNavbars from '../../LoginSignup/UserNavbar';
import './UserProducts.css';
import jwt_decode from 'jwt-decode';

const UserProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [teams, setTeams] = useState({});
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  
  // Fetch the user ID from the JWT token
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;

  // Function to add a product to the wishlist
const addToWishlist = async (productId) => {
  try {
    const response = await fetch('https://localhost:7092/api/Wishlist/AddToWishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: productId,
        userId: userId // Assuming userId is accessible in this scope
      })
    });
    if (response.status === 201) {
      console.log("Added to wishlist successfully");
      window.location.reload(); // Reload the page on success
    } else if (response.status === 409) {
      console.log("Product already exists in the wishlist");
      // Handle conflict scenario if needed
    } else {
      console.error("Failed to add to wishlist:", response.statusText);
      // Handle other error scenarios if needed
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

// Function to remove a product from the wishlist
const removeFromWishlist = async (productId) => {
  try {
    const response = await fetch('https://localhost:7092/api/Wishlist/RemoveFromWishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: productId,
        userId: userId // Assuming userId is accessible in this scope
      })
    });
    if (response.ok) {
      console.log("Removed from wishlist successfully");
      window.location.reload(); // Reload the page on success
    } else if (response.status === 404) {
      console.log("Wishlist item not found");
      // Handle not found scenario if needed
    } else {
      console.error("Failed to remove from wishlist:", response.statusText);
      // Handle other error scenarios if needed
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
  }
};



  useEffect(() => {
    // Function to fetch wishlist items for the user
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Wishlist/GetWishlistByUserId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: userId })
        });
        const wishlistItems = await response.json();
        setWishlistedProducts(wishlistItems.map(item => item.productId));
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    // Function to fetch products
    const fetchProducts = async () => {
      try {

        const resp = await fetch(`https://localhost:7092/api/ProductCategory/GetProductCategoryIdByUniqueName?uniqueName=${categoryId}`);
        const categoryIdResponse = await resp.json(); // Convert response to JSON
        console.log("Product Category ID:", categoryIdResponse); // Log the response

        const response = await fetch(`https://localhost:7092/api/Product/GetAllProductsByCategoryId/${categoryIdResponse}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Function to fetch teams
    const fetchTeams = async () => {
      try {
        const response = await fetch('https://localhost:7092/api/Team/GetTeams');
        const data = await response.json();
        const teamData = {};
        data.forEach(team => {
          teamData[team.teamId] = team.name;
        });
        setTeams(teamData);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchWishlist(); // Fetch wishlist items
    fetchProducts(); // Fetch products
    fetchTeams(); // Fetch teams
  }, [categoryId, userId]); // Add userId to the dependency array

  const handleProductClick = (productId) => {
    console.log('Clicked product ID:', productId);
  };

  // Function to check if a product is wishlisted
  const isProductWishlisted = (productId) => {
    return wishlistedProducts.includes(productId);
  };

  return (
    <div>
      <UserNavbars />
      <br />
      <br />
      <br />
      <br />
      <div className="product-container">
        {products.map(product => (
          <div key={product.productId} className="product-item">
            <a href={`/ProductDetails/${product.uniqueName}`} className="product-link">
              <img src={`https://localhost:7092/images/${product.imagePath1}`} alt={product.productName} className="product-images" />
              <p className="product-name">{product.productName}</p>
            </a>
            <p className="team-name">Team: {teams[product.teamId]}</p>
            <p className="product-price">Price: ${product.price}</p>
            <div className="product-heart">
              {isProductWishlisted(product.productId) ? (
                <React.Fragment>
                  <span className="product-heart1">&#x2764;</span>
                  <button onClick={() => removeFromWishlist(product.productId)}>Remove From Wish List</button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span className="product-heart2">&#x2661;</span>
                  <button onClick={() => addToWishlist(product.productId)}>Add To Wish List</button>
                </React.Fragment>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProducts;
