import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';
import TeamSidebar from '../sidebar/TeamSidebar';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';

const ProductListTeam = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
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

      if (roleId !== 'Admin' && roleId !== 'Team') {
        toast.error('You have to be logged in as Admin to access the page');
        navigate('/');
        return;
      }

      axios
        .get(`https://localhost:7092/api/Product/GetProducts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('Product data:', response.data);
          setProductData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching product data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            // You might want to redirect to the login page here
            navigate('/');
          } else {
            toast.error('An error occurred while fetching product data');
          }
        });

      axios
        .get(`https://localhost:7092/api/ProductCategory/GetAllProductCategories`)
        .then((response) => {
          console.log('Category data:', response.data);
          setCategoryData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching category data:', error);
          toast.error('An error occurred while fetching category data');
        });
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const getCategoryName = (categoryId) => {
    const category = categoryData.find((cat) => cat.id === categoryId);
    return category ? category.name : '';
  };

  const handleEditProduct = (productId) => {
    // Redirect to the UpdateProductTeam page with the specific productId
    navigate(`/UpdateProductTeam`, { replace: true, state: { productId } });
  };

  const renderProductData = () => {
    if (!productData || !categoryData.length) {
      return <p>Loading product data...</p>;
    }
  
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock Quantity</TableCell>
              <TableCell>Product Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productData.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>{getCategoryName(product.productCategoryId)}</TableCell>
                <TableCell>{product.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditProduct(product.productId)}
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
    <div className="productlistpage">
      <TeamNavbar />
      <div className="container-fluid">
        <div className="row">
          <TeamSidebar /> {/* Display the TeamSidebar component as a sidebar */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <br />
            {renderProductData()}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductListTeam;