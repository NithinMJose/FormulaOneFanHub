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
  const [errorMessage, setErrorMessage] = useState('');

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
    if (field === 'stockQuantity' && value < 0) {
      setErrorMessage('Stocks below zero are not Possible');
    } else {
      setErrorMessage('');
      setProductData((prevData) => ({ ...prevData, [field]: value }));
    }
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
                <Typography  style={{ fontWeight: 'bold', color: 'black', fontFamily: 'sans-serif', fontSize:'30px' }} gutterBottom>
                  Product Stock Updation
                </Typography>
                <hr></hr>
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
                    <Typography>
                      <strong>Product Category:</strong>{' '}
                      {categories.find((category) => category.id === productData.productCategoryId)?.name}
                    </Typography>
                  </Grid>


                  <Grid container item xs={12} spacing={2}>
                  <Grid item xs={6}>
                  <InputLabel style={{ fontWeight: 'bold', color: 'black' }}>Stock Quantity</InputLabel>
                  <TextField
                      className='formControlStock'
                      type="number"
                      fullWidth
                      style={{ maxWidth: '200px', minWidth: '200px'}} // Adjust the maximum width as needed
                      value={productData.stockQuantity}
                      onChange={(e) => handleFieldChange('stockQuantity', e.target.value)}
                    />
                    {errorMessage && (
                      <Typography style={{ color: 'red' }}>{errorMessage}</Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                  <Grid item xs={6}>
                  <InputLabel style={{ fontWeight: 'bold', color: 'black' }}>Is Active ?</InputLabel>
                  <Select
                  style={{ maxWidth: '200px', minWidth: '200px' }} // Adjust the maximum width as needed
                      value={productData.isActive}
                      onChange={(e) => handleFieldChange('isActive', e.target.value)}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                
                
                

                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleUpdateClick}>
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
