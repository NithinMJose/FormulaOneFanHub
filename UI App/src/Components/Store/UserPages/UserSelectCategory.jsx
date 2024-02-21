import React, { useState, useEffect } from 'react';
import './UserSelectCategory.css';
import UserNavbar from '../../LoginSignup/UserNavbar';
import { useNavigate } from 'react-router-dom';


const UserSelectCategory = () => {
  const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

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

  const handleClick = (categoryId) => {
    console.log('Clicked category id:', categoryId);
    // Navigating to the next page with the category id as a state
    navigate('/UserProducts', { state: { categoryId } });    
  };

  return (
    <div>
      <UserNavbar />
      <div className="category-list-container">
        {categories.map((category) => (
          <div
            key={category.productCategoryId}
            className="category-item"
            onClick={() => handleClick(category.productCategoryId)} // Adding onClick handler
          >
            <img
              src={`https://localhost:7092/images/${category.imagePath}`} 
              alt={`${category.pCategoryName}'s Image`}
              className="category-image"
            />
            <h2 className="category-name">{category.pCategoryName}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSelectCategory;
