import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField, Typography, Container, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';
import TeamSidebar from '../sidebar/TeamSidebar';

const AddProductTeam = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [teamId, setTeamId] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  //const [discountAmount, setDiscountAmount] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productNameError, setProductNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [stockQuantityError, setStockQuantityError] = useState('');
  //const [discountAmountError, setDiscountAmountError] = useState('');
  const [imageFileErrors, setImageFileErrors] = useState([]);

  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [imageFile3, setImageFile3] = useState(null);
  const [imageFile4, setImageFile4] = useState(null);

  const [previewImage1, setPreviewImage1] = useState(null);
  const [previewImage2, setPreviewImage2] = useState(null);
  const [previewImage3, setPreviewImage3] = useState(null);
  const [previewImage4, setPreviewImage4] = useState(null);

  const token = localStorage.getItem('jwtToken');
  const decodedToken = jwt_decode(token);
  const TeamId = decodedToken.teamId;

  const navigate = useNavigate();

  useEffect(() => {
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
    }

    // Check if the product name has at least 1 alphabet
    if (!/[a-zA-Z]/.test(value)) {
      setProductNameError('Product name must contain at least 1 alphabet');
      return false;
    }

    // Check if the product name length is within the limit
    if (value.length > 15) {
      setProductNameError('Product name must be at most 15 characters long');
      return false;
    }

    // Check if the product name is not empty
    if (!value.trim()) {
      setProductNameError('Product name is required');
      return false;
    }

    // If all conditions are met, clear the error
    setProductNameError('');
    return true;
  };


  const validatePrice = (value) => {
    const parsedPrice = parseFloat(value);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setPriceError('Price must be a valid number greater than 0');
      return false;
    }
    // Check if the price is not empty
    if (!value.trim()) {
      setPriceError('Price is required');
      return false;
    }
    //maximum 2 decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      setPriceError('Price must have at most 2 decimal places');
      return false;
    }
    //maximum value is 100000
    if (parsedPrice > 100000) {
      setPriceError('Price must be at most 100000');
      return false;
    }

    //maximum no. of character is 9
    if (value.length > 9) {
      setPriceError('Price must be at most 9 characters long');
      return false;
    }
    //first 2 numbers should not be 0 and entering like 000005 is not allowed but like 0.5 is allowed
    if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
      setPriceError('Avoid unnecessary leading zeros in price');
      return false;
    }

    else {
      setPriceError('');
      return true;
    }
  };

  const validateDescription = (value) => {
    // Remove whitespace from the description and check its length
    const nonWhiteSpaceChars = value.replace(/\s/g, '');

    // Check if the description has at least 3 non-whitespace characters
    if (nonWhiteSpaceChars.length < 3) {
      setDescriptionError('Description should contain at least 3 non-whitespace characters');
      return false;
    }

    //maximum 300 characters
    if (value.length > 300) {
      setDescriptionError('Description must be at most 300 characters long');
      return false;
    }
    else {
      setDescriptionError('');
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

  // const validateDiscountAmount = (value) => {
  //   const parsedDiscount = parseInt(value);
  //   if (isNaN(parsedDiscount) || parsedDiscount < 0) {
  //     setStockQuantityError('Discount amount must be a non-negative integer');
  //     return false;
  //   } else {
  //     setStockQuantityError('');
  //     return true;
  //   }
  // };


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
    setPreviewImage1(URL.createObjectURL(file));
  };
  
  const handleImageChange2 = (event) => {
    const file = event.target.files[0];
    setImageFile2(file);
    setPreviewImage2(URL.createObjectURL(file));
  };

  const handleImageChange3 = (event) => {
    const file = event.target.files[0];
    setImageFile3(file);
    setPreviewImage3(URL.createObjectURL(file));
  };
  
  const handleImageChange4 = (event) => {
    const file = event.target.files[0];
    setImageFile4(file);
    setPreviewImage4(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);
  
      try {
        const parsedTeamId = parseInt(TeamId);
  
        const formData = new FormData();
        formData.append('ProductName', productName);
        formData.append('Description', description);
        formData.append('Price', price);
        formData.append('TeamId', parsedTeamId);
        formData.append('ProductCategoryId', productCategoryId);
        formData.append('StockQuantity', stockQuantity);
        //formData.append('DiscountAmount', discountAmount);
        formData.append('imageFile1', imageFile1);
        formData.append('imageFile2', imageFile2);
        formData.append('imageFile3', imageFile3);
        formData.append('imageFile4', imageFile4);
  
        for (var pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }
  
        const createProductResponse = await fetch('https://localhost:7092/api/Product/CreateProduct', {
          method: 'POST',
          body: formData,
        });
  
        if (createProductResponse.status === 201) {
          toast.success('Product added successfully');
          navigate('/ProductListTeam');
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

  return (
    <div>
      <TeamNavbar/>
      <br />
      <br />
      <br />
      <br />
      <div style={{ display: 'flex' }}>
        <TeamSidebar/>
        <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
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
                    style={{ marginBottom: '20px' }}
                  />
                  <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      validateDescription(e.target.value);
                    }
                    }
                    error={Boolean(descriptionError)}
                    helperText={descriptionError}
                    style={{ marginBottom: '20px' }}
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
                    style={{ marginBottom: '20px' }}
                  />
                  
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={productCategoryId}
                      onChange={(e) => setProductCategoryId(e.target.value)}
                      label="Category"
                      style={{ marginBottom: '20px' }}
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
                    style={{ marginBottom: '20px' }}
                  />
{/* 
                  <TextField
                    label="Discount Amount"
                    variant="outlined"
                    fullWidth
                    value={discountAmount}
                    onChange={(e) => {
                      setDiscountAmount(e.target.value);
                      validateDiscountAmount(e.target.value);
                    }}
                    error={Boolean(discountAmountError)}
                    helperText={discountAmountError}
                    style={{ marginBottom: '20px' }}
                  />
*/}

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
                    {previewImage1 && (
                      <img
                        src={previewImage1}
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
                    {previewImage2 && (
                      <img
                        src={previewImage2}
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
                    {previewImage3 && (
                      <img
                        src={previewImage3}
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
                    {previewImage4 && (
                      <img
                        src={previewImage4}
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddProductTeam;
