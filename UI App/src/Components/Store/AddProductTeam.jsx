import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField, Typography, Container, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';


const AddProductTeam = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [teamId, setTeamId] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productNameError, setProductNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [stockQuantityError, setStockQuantityError] = useState('');
  const [imageFileErrors, setImageFileErrors] = useState([]);

  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [imageFile3, setImageFile3] = useState(null);
  const [imageFile4, setImageFile4] = useState(null);


  const token = localStorage.getItem('jwtToken');
  const decodedToken = jwt_decode(token);
  const TeamId = decodedToken.teamId;

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch teams and categories data from the server
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch('https://localhost:7092/api/ProductCategory/GetAllProductCategories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      }
    };
  
    fetchData();
  }, []);

  const validateProductName = (value) => {
    if (!value.trim() || value.length < 3) {
      setProductNameError('Product name should be at least 3 characters long');
      return false;
    } else {
      setProductNameError('');
      return true;
    }
  };

  const validatePrice = (value) => {
    const parsedPrice = parseFloat(value);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setPriceError('Price must be a valid number greater than 0');
      return false;
    } else {
      setPriceError('');
      return true;
    }
  };

  const validateStockQuantity = (value) => {
    const parsedQuantity = parseInt(value);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      setStockQuantityError('Stock quantity must be a non-negative integer');
      return false;
    } else {
      setStockQuantityError('');
      return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateProductName(productName);
    isValid = isValid && validatePrice(price);
    isValid = isValid && validateStockQuantity(stockQuantity);

    return isValid;
  };


  const handleImageChange1 = (event) => {
    const file = event.target.files[0];
    setImageFile1(file);
  };
  
  const handleImageChange2 = (event) => {
    const file = event.target.files[0];
    setImageFile2(file);
  };


  const handleImageChange3 = (event) => {
    const file = event.target.files[0];
    setImageFile3(file);
  };
  
  const handleImageChange4 = (event) => {
    const file = event.target.files[0];
    setImageFile4(file);
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);
  
      try {
        const parsedTeamId = parseInt(TeamId);
        console.log('TeamId:', parsedTeamId);
  
        const formData = new FormData();
        formData.append('ProductName', productName);
        formData.append('Description', description);
        formData.append('Price', price);
        formData.append('TeamId', parsedTeamId);
        formData.append('ProductCategoryId', productCategoryId);
        formData.append('StockQuantity', stockQuantity);
        formData.append('imageFile1', imageFile1);
        formData.append('imageFile2', imageFile2);
        formData.append('imageFile3', imageFile3);
        formData.append('imageFile4', imageFile4);
  
        //print the form data using for loop
        for (var pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }
  
        const createProductResponse = await fetch('https://localhost:7092/api/Product/CreateProduct', {
          method: 'POST',
          body: formData,
        });
  
        if (createProductResponse.status === 201) {
          toast.success('Product added successfully');
          navigate('/ProductList');
          // Additional logic or navigation can be added here
        } else {
          const errorData = await createProductResponse.json();
          console.error('Product creation failed:', errorData);
          toast.error('Product creation failed');
        }
      } catch (error) {
        console.error('Product creation failed:', error);
        toast.error('Product creation failed');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all required fields and correct validation errors.');
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImageFiles(files);

    const errors = files.map((file) => {
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        return 'Only JPEG or PNG files are allowed';
      }
      return '';
    });

    setImageFileErrors(errors);
  };

  return (
    <div>
      <AdminNavbar />
      <Container maxWidth="sm" className="outerSetup">
        <br />
        <br />
        <div className="add-product-team-container">
          <div className="add-product-team-panel">
            <Typography variant="h5" className="add-product-team-header">
              Add Product Team
            </Typography>
            <div className="add-product-team-inputsadmin">
              <TextField
                label="Product Name"
                variant="outlined"
                fullWidth
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  validateProductName(e.target.value);
                }}
                error={Boolean(productNameError)}
                helperText={productNameError}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  validatePrice(e.target.value);
                }}
                error={Boolean(priceError)}
                helperText={priceError}
              />
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={productCategoryId}
                  onChange={(e) => setProductCategoryId(e.target.value)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Stock Quantity"
                variant="outlined"
                fullWidth
                value={stockQuantity}
                onChange={(e) => {
                  setStockQuantity(e.target.value);
                  validateStockQuantity(e.target.value);
                }}
                error={Boolean(stockQuantityError)}
                helperText={stockQuantityError}
              />
              <div>
                <input
                  accept="image/jpeg, image/jpg, image/png"
                  style={{ display: 'none' }}
                  id="image-files-input1"
                  type="file"
                  onChange={handleImageChange1}
                />
                <label htmlFor="image-files-input1">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    style={{ height: '55px', marginBottom: '10px' }}
                  >
                    Upload Image 1
                  </Button>
                </label>
                {imageFile1 && (
                  <img
                    src={`https://localhost:7092/images/${imageFile1.name}`}
                    alt="Uploaded"
                    style={{ maxWidth: '100px', maxHeight: '100px', marginLeft: '10px' }}
                  />
                )}
              </div>
              <div>
                <input
                  accept="image/jpeg, image/jpg, image/png"
                  style={{ display: 'none' }}
                  id="image-files-input2"
                  type="file"
                  onChange={handleImageChange2}
                />
                <label htmlFor="image-files-input2">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    style={{ height: '55px', marginBottom: '10px' }}
                  >
                    Upload Image 2
                  </Button>
                </label>
                {imageFile2 && (
                  <img
                    src={`https://localhost:7092/images/${imageFile2.name}`}
                    alt="Uploaded"
                    style={{ maxWidth: '100px', maxHeight: '100px', marginLeft: '10px' }}
                  />
                )}
              </div>
              <div>
                <input
                  accept="image/jpeg, image/jpg, image/png"
                  style={{ display: 'none' }}
                  id="image-files-input3"
                  type="file"
                  onChange={handleImageChange3}
                />
                <label htmlFor="image-files-input3">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    style={{ height: '55px', marginBottom: '10px' }}
                  >
                    Upload Image 3
                  </Button>
                </label>
                {imageFile3 && (
                  <img
                    src={`https://localhost:7092/images/${imageFile3.name}`}
                    alt="Uploaded"
                    style={{ maxWidth: '100px', maxHeight: '100px', marginLeft: '10px' }}
                  />
                )}
              </div>
              <div>
                <input
                  accept="image/jpeg, image/jpg, image/png"
                  style={{ display: 'none' }}
                  id="image-files-input4"
                  type="file"
                  onChange={handleImageChange4}
                />
                <label htmlFor="image-files-input4">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    style={{ height: '55px' }}
                  >
                    Upload Image 4
                  </Button>
                </label>
                {imageFile4 && (
                  <img
                    src={`https://localhost:7092/images/${imageFile4.name}`}
                    alt="Uploaded"
                    style={{ maxWidth: '100px', maxHeight: '100px', marginLeft: '10px' }}
                  />
                )}
              </div>
            </div>
            <div className="add-product-team-submit-container">
              <Button
                variant="contained"
                color="primary"
                className="add-product-team-submit"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Product Team'}
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
  
}  

export default AddProductTeam;
