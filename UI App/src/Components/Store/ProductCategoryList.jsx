import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import axios from 'axios';
import './ProductCategoryList.css'; // Make sure to include your ProductCategoryList.css file
import Footer from '../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';

const ProductCategoryList = () => {
  const navigate = useNavigate();
  const [productCategories, setProductCategories] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      const tokenPayload = jwt_decode(token);
      const roleId = tokenPayload['RoleId'];

      if (roleId !== 'Admin') {
        toast.error('You have to be logged in as Admin to access the page');
        navigate('/');
        return;
      }

      axios
        .get(`https://localhost:7092/api/ProductCategory/GetProductCategories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProductCategories(response.data);
        })
        .catch((error) => {
          console.error('Error fetching product categories:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            // You might want to redirect to the login page here
            navigate('/');
          } else {
            toast.error('An error occurred while fetching product categories');
          }
        });
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const handleManageProductCategory = (productCategoryId) => {
    // Redirect to the UpdateProductCategory page with the specific productCategoryId
    navigate(`/UpdateProductCategory`, { replace: true, state: { productCategoryId } });
  };

  const renderProductCategories = () => {
    if (!productCategories) {
      return <p>Loading product categories...</p>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>ID</TableCell>
              <TableCell style={{ width: '30%' }}>Category Name</TableCell>
              <TableCell style={{ width: '40%' }}>Image</TableCell>
              <TableCell style={{ width: '25%' }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productCategories.map((category) => (
              <TableRow key={category.productCategoryId}>
                <TableCell>{category.productCategoryId}</TableCell>
                <TableCell>{category.pCategoryName}</TableCell>
                <TableCell>
                  {category.imagePath ? (
                    <img
                      src={`https://localhost:7092/images/${category.imagePath}`}
                      alt={`Image for ${category.pCategoryName}`}
                      className="category-image"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: '150px', height: '150px' }}
                      onLoad={() => console.log(`Image loaded for ${category.pCategoryName}: ${category.imagePath}`)}
                      onError={() => console.error(`Error loading image for ${category.pCategoryName}: ${category.imagePath}`)}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManageProductCategory(category.productCategoryId)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="product-category-list-page">
      <AdminNavbar />
      <br />
      <br />
      <br />
      <br />
      {renderProductCategories()}
      <br />
      <Footer />
    </div>
  );
};

export default ProductCategoryList;
