import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import TeamSidebar from '../sidebar/TeamSidebar';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';
import Footer from '../LoginSignup/Footer';

const UpdateProductStock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state.productId;

  const [productData, setProductData] = useState({
    productName: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    productCategoryId: 0,
    imagePath1: '',
    imagePath2: '',
    imagePath3: '',
    imagePath4: '',
    isActive: false,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/ProductCategory/GetAllProductCategories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product categories:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/Product/GetProductById?id=${productId}`)
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, [productId]);

  const handleFieldChange = (field, value) => {
    setProductData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleUpdateClick = () => {
    const data = {
      stockQuantity: productData.stockQuantity,
      isActive: productData.isActive,
    };

    axios
      .put(`https://localhost:7092/api/Product/UpdateQuantityAndActive/${productId}`, data)
      .then((response) => {
        toast.success('Update successful');
        console.log('Product data updated:', response.data);
        navigate('/ProductListTeam');
      })
      .catch((error) => {
        console.error('Error updating product data:', error);
        toast.error('Error updating product data');
      });
  };

  return (
    <div className="productlistpage">
      <TeamNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="container-fluid">
        <div className="row">
          <TeamSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                  Product Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>
                      <strong>Product Name:</strong> {productData.productName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <strong>Description:</strong> {productData.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <strong>Price:</strong> {productData.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Stock Quantity"
                      type="number"
                      fullWidth
                      value={productData.stockQuantity}
                      onChange={(e) => handleFieldChange('stockQuantity', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
  <Typography>
    <strong>Product Category:</strong> {categories.find(category => category.id === productData.productCategoryId)?.name}
  </Typography>
</Grid>

                  {[1, 2, 3, 4].map((number) => (
                    productData[`imagePath${number}`] && (
                      <Grid item xs={12} key={number}>
                        <img
                          src={`https://localhost:7092/images/${productData[`imagePath${number}`]}`}
                          alt={`Product Image ${number}`}
                          className="product-image"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      </Grid>
                    )
                  ))}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Active</InputLabel>
                      <Select
                        value={productData.isActive}
                        onChange={(e) => handleFieldChange('isActive', e.target.value)}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateClick}
                    >
                      Apply the changes to DB
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProductStock;
