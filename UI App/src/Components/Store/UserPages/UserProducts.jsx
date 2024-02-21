import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserNavbar from '../../LoginSignup/UserNavbar';
import './UserProducts.css';

const UserProducts = () => {
  const location = useLocation();
  const categoryId = location.state.categoryId;
  const [products, setProducts] = useState([]);
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Product/GetAllProductsByCategoryId/${categoryId}`);
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

    fetchProducts();
    fetchTeams();
  }, [categoryId]);

  return (
    <div>
      <UserNavbar />
      <h1>Products for Category ID: {categoryId}</h1>
      <div className="product-container">
        {products.map(product => (
          <div key={product.productId} className="product-item">
            <img src={`https://localhost:7092/images/${product.imagePath1}`} alt={product.productName} className="product-image" />
            <p className="product-name">{product.productName}</p>
            <p className="team-name">Team: {teams[product.teamId]}</p>
            <p className="product-price">Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProducts;