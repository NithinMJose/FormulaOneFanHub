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

  const handleCategoryClick = (uniqueName) => {
    // Redirect to the desired page when category name is clicked
    window.location.href = `/UserProducts/${uniqueName}`;
  };

  return (
    <div className='HelloWorld'>
      <UserNavbar />
      <div className='CategoriesContainer'>
        <div className="SimpleSidebar">
          <div className="choose-category-text">GET YOUR GEARS HERE!</div>
          <div className="categoryDescription1">
            Unleash Your Formula One Passion with Our Exclusive Collection
          </div>
          <div className="categoryDescription4">
            Start your journey today and discover the perfect piece to add to your collection!
          </div>
        </div>
      <div className="category-list-container">
        {categories.map((category) => (
          <div key={category.productCategoryId} className="category-item">
            <Link to={`/UserProducts/${category.uniqueName}`}>
              <div className="category-image">
                <img
                  src={`https://localhost:7092/images/${category.imagePath}`}
                  alt={`${category.pCategoryName}'s Image`}
                  className="category-image"
                />
              </div>
            </Link>
            <div className="CategoryName" onClick={() => handleCategoryClick(category.uniqueName)}>{category.pCategoryName}</div>
          </div>
        ))}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserSelectCategory;
