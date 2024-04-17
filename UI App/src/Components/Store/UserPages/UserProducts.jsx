import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserNavbars from '../../LoginSignup/UserNavbar';
import './UserProducts.css';
import jwt_decode from 'jwt-decode';
import Footer from '../../LoginSignup/Footer';

const UserProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [teams, setTeams] = useState({});
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState({
    under500: false,
    '501-1000': false,
    '1001-2000': false,
    above2001: false,
  });
  const [sortBy, setSortBy] = useState('featured'); // New state for sorting

  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;

  const addToWishlist = async (productId) => {
    try {
      const response = await fetch('https://localhost:7092/api/Wishlist/AddToWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productId,
          userId: userId
        })
      });
      if (response.status === 201) {
        console.log("Added to wishlist successfully");
        window.location.reload();
      } else if (response.status === 409) {
        console.log("Product already exists in the wishlist");
      } else {
        console.error("Failed to add to wishlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
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
        console.log("Removed from wishlist successfully");
        window.location.reload();
      } else if (response.status === 404) {
        console.log("Wishlist item not found");
      } else {
        console.error("Failed to remove from wishlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  useEffect(() => {
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

    const fetchProducts = async () => {
      try {
        const resp = await fetch(`https://localhost:7092/api/ProductCategory/GetProductCategoryIdByUniqueName?uniqueName=${categoryId}`);
        const categoryIdResponse = await resp.json();
        const response = await fetch(`https://localhost:7092/api/Product/GetAllProductsByCategoryId/${categoryIdResponse}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

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
    fetchWishlist();
    fetchProducts();
    fetchTeams();
  }, [categoryId, userId]);

  const handlePriceRangeChange = (e) => {
    setSelectedPriceRanges({
      ...selectedPriceRanges,
      [e.target.value]: e.target.checked,
    });
  };

  const isProductInPriceRange = (product) => {
    if (!Object.values(selectedPriceRanges).some(value => value)) return true;

    const price = product.price;
    return Object.entries(selectedPriceRanges).some(([range, selected]) => {
      if (!selected) return false;

      switch (range) {
        case 'under500':
          return price <= 500;
        case '501-1000':
          return price >= 501 && price <= 1000;
        case '1001-2000':
          return price >= 1001 && price <= 2000;
        case 'above2001':
          return price > 2001;
        default:
          return false;
      }
    });
  };

  const isProductWishlisted = (productId) => {
    return wishlistedProducts.includes(productId);
  };

  const sortProducts = (products) => {
    // Sorting products based on selected sort option
    if (sortBy === 'price') {
      return [...products].sort((a, b) => a.price - b.price);
    } else {
      return products; // Keep the original order for "Featured"
    }
  };

  return (
    <div>
      <div className='UserProductsWrapper'>
        <UserNavbars />
        <div className='DemoSideBar'>

          <h1 className='SortByText'>Sort By</h1>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price">Price</option>
          </select>


          <h1 className='TeamFilterText'>Filter by Team</h1>
          <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
            <option value="">All Teams</option>
            {Object.keys(teams).map((teamId) => (
              <option key={teamId} value={teamId}>{teams[teamId]}</option>
            ))}
          </select>

          <h1 className='PriceFilterText'>Filter by Price</h1>
          <div>
            <label>
              <input type="checkbox" value="under500" checked={selectedPriceRanges.under500} onChange={handlePriceRangeChange} />
              Under 500
            </label>
            <label>
              <input type="checkbox" value="501-1000" checked={selectedPriceRanges['501-1000']} onChange={handlePriceRangeChange} />
              501 - 1000
            </label>
            <label>
              <input type="checkbox" value="1001-2000" checked={selectedPriceRanges['1001-2000']} onChange={handlePriceRangeChange} />
              1001 - 2000
            </label>
            <label>
              <input type="checkbox" value="above2001" checked={selectedPriceRanges.above2001} onChange={handlePriceRangeChange} />
              Above 2001
            </label>
          </div>

          {/*}
          <div className='TicketBookingAd'>
            <h1 className='TicketBookingAdText'>Book Your Tickets Now</h1>
            <div className="imageBox">
              <div className='TicketText'>Dont miss the chance to Grab the Ticket!</div>
            </div>
          </div>
        */}

        </div>
        <div className="productContainers" style={{ marginTop: "100px" }}>
          {sortProducts(products.filter(product => (!selectedTeam || Number(product.teamId) === Number(selectedTeam)) && isProductInPriceRange(product))).map(product => (
            <div key={product.productId} className="product-item">
              <a href={`/ProductDetails/${product.uniqueName}`} className="product-link">
                <div className="product-heart">
                  {isProductWishlisted(product.productId) ? (
                    <span className="product-heart1">&#x2764;</span>
                  ) : (
                    <span className="product-heart2">&#x2661;</span>
                  )}
                </div>
              <img src={`https://localhost:7092/images/${product.imagePath1}`} alt={product.productName} className="product-imagess" />
              <p className="product-names">{product.productName}</p>
            </a>
            <p className="team-name">Team: {teams[product.teamId]}</p>
            <p className="product-price">Price: ₹{product.price}</p>
            {product.stockQuantity === 0 ? (
              <p className="out-of-stock">Out Of Stock</p>
            ) : (
              <p className='Stocks'>Stocks: {product.stockQuantity}</p>
            )}
            <div className="product-heart">
                {isProductWishlisted(product.productId) ? (
                  <button onClick={() => removeFromWishlist(product.productId)}>Remove From Wish List</button>
                ) : (
                    <button name="addToWishButton" className='addToWishButton' onClick={() => addToWishlist(product.productId)}>Add To Wish List</button>
              )}
            </div>
          </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProducts;
