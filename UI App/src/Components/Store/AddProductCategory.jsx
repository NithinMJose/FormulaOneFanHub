import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';

const AddProductCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [categoryNameError, setCategoryNameError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

  const navigate = useNavigate();

  const validateCategoryName = (value) => {
    if (!value.trim() || value.length < 3) {
      setCategoryNameError('Category name should be at least 3 characters long');
      return false;
    } else {
      setCategoryNameError('');
      return true;
    }
  };

  const validateImage = (file) => {
    if (!file || !file.type.match(/image\/(jpeg|jpg|png)/)) {
      setImageFileError('Only JPEG or PNG files are allowed');
      return false;
    } else {
      setImageFileError('');
      return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateCategoryName(categoryName);
    isValid = isValid && validateImage(imageFile);

    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('PCategoryName', categoryName);
        formData.append('ImageFile', imageFile);

        const createProductCategoryResponse = await fetch('https://localhost:7092/api/ProductCategory/CreateProductCategory', {
          method: 'POST',
          body: formData,
        });

        if (createProductCategoryResponse.status === 201) {
          toast.success('Product category added successfully');
          navigate('/ProductCategoryList');
          // Additional logic or navigation can be added here
        } else {
          const errorData = await createProductCategoryResponse.json();
          console.error('Product category creation failed:', errorData);
          toast.error('Product category creation failed');
        }
      } catch (error) {
        console.error('Product category creation failed:', error);
        toast.error('Product category creation failed');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all required fields and correct validation errors.');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <Container maxWidth="sm" className="outerSetup">
        <br />
        <br />

        <div className="add-product-category-container">
          <div className="add-product-category-panel">
            <Typography variant="h5" className="add-product-category-header">
              Add Product Category
            </Typography>
            <div className="add-product-category-inputsadmin">
              <TextField
                label="Category Name"
                variant="outlined"
                fullWidth
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  validateCategoryName(e.target.value);
                }}
                error={Boolean(categoryNameError)}
                helperText={categoryNameError}
              />
              <input
                accept="image/jpeg, image/jpg, image/png"
                style={{ display: 'none' }}
                id="image-file-input"
                type="file"
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  validateImage(e.target.files[0]);
                }}
              />
              <label htmlFor="image-file-input">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  style={{ height: '55px' }}
                >
                  Upload Image
                </Button>
              </label>
              {imageFileError && (
                <Typography variant="caption" color="error">
                  {imageFileError}
                </Typography>
              )}
            </div>
            <div className="add-product-category-submit-container">
              <Button
                variant="contained"
                color="primary"
                className="add-product-category-submit"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Product Category'}
              </Button>
            </div>
          </div>
        </div>

        <br />
        <br />
      </Container>
      <Footer />
    </div>
  );
};

export default AddProductCategory;
