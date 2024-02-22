import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserNavbars from '../../LoginSignup/UserNavbars';
import './UserProducts.css';

const UserProducts = () => {
  const { categoryId } = useParams();
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

  const handleProductClick = (productId) => {
    console.log('Clicked product ID:', productId);
  };

  return (
    <div>
      <UserNavbars />
      <h1 className="page-title">Products for Category ID: {categoryId}</h1>
      <div className="product-container">
        {products.map(product => (
          <Link key={product.productId} to={`/ProductDetails/${product.productId}`} className="product-item">
            <img src={`https://localhost:7092/images/${product.imagePath1}`} alt={product.productName} className="product-image" />
            <p className="product-name">{product.productName}</p>
            <p className="team-name">Team: {teams[product.teamId]}</p>
            <p className="product-price">Price: ${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserProducts;
