import React, { useState, useEffect } from 'react';
import './UserSelectCategory.css';
import UserNavbar from '../../LoginSignup/UserNavbar';
import { Link } from 'react-router-dom';
import Footer from '../../LoginSignup/Footer';

const UserSelectCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7092/api/ProductCategory/GetProductCategories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <UserNavbar />
      <div className="category-list-container">
        {categories.map((category) => (
          <Link key={category.productCategoryId} to={`/UserProducts/${category.uniqueName}`} className="category-item">
            <img
              src={`https://localhost:7092/images/${category.imagePath}`} 
              alt={`${category.pCategoryName}'s Image`}
              className="category-image"
            />
            <div className="category-name">{category.pCategoryName}</div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default UserSelectCategory;
