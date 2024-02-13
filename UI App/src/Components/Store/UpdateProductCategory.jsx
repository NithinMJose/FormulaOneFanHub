import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdateProductCategory.css';
import Footer from '../LoginSignup/Footer';
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const UpdateProductCategory = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const productCategoryId = state.productCategoryId;

  const [productCategoryData, setProductCategoryData] = useState({
    pCategoryName: '',
    imagePath: '',
    imageFile: null,
  });

  const [pCategoryNameError, setPCategoryNameError] = useState('');

  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/ProductCategory/GetProductCategoryById?id=${productCategoryId}`)
      .then((response) => {
        setProductCategoryData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product category data:', error);
      });
  }, [productCategoryId]);

  const handleFieldChange = (field, value) => {
    setProductCategoryData((prevData) => ({ ...prevData, [field]: value }));
    validateField(field, value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file || (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
      toast.error('Please upload a valid PNG or JPG image.');
      return;
    }

    setProductCategoryData((prevData) => ({
      ...prevData,
      imageFile: file,
      imagePath: URL.createObjectURL(file),
    }));
  };

  const handleUpdateClick = () => {
    if (!validateForm()) {
      toast.error('Check all input fields and apply again');
      return;
    }

    const formData = new FormData();
    formData.append('id', productCategoryId);
    formData.append('pCategoryName', productCategoryData.pCategoryName);

    if (productCategoryData.imageFile) {
      formData.append('imageFile', productCategoryData.imageFile);
    }

    axios
      .put(`https://localhost:7092/api/ProductCategory/UpdateProductCategory`, formData)
      .then((response) => {
        console.log('Update successful:', response);
        toast.success('Update successful');
        navigate('/ProductCategoryList');
      })
      .catch((error) => {
        console.error('Error updating product category data:', error);
        console.log('Form Data:', formData);
        toast.error('Error updating product category data');
      });
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'pCategoryName':
        validatePCategoryName(value);
        break;
      default:
        break;
    }
  };

  const validatePCategoryName = (value) => {
    if (value.trim().length === 0) {
      setPCategoryNameError('Category name cannot be empty');
      return false;
    } else {
      setPCategoryNameError('');
      return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validatePCategoryName(productCategoryData.pCategoryName);

    return isValid;
  };

  return (
    <div>
      <AdminNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Product Category Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Category Name"
                fullWidth
                value={productCategoryData.pCategoryName}
                onChange={(e) => handleFieldChange('pCategoryName', e.target.value)}
                error={Boolean(pCategoryNameError)}
                helperText={pCategoryNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            onClick={handleUpdateClick}
          >
            Apply the changes to db
          </Button>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default UpdateProductCategory;
