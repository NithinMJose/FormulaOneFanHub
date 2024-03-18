import React, { useState } from 'react';
import './AddDeliveryCompany.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField, Typography, Container, InputAdornment } from '@mui/material';
import AdminNavbar from '../../LoginSignup/AdminNavbar';
import Footer from '../../LoginSignup/Footer';

const AddDeliveryCompany = () => {
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [companyNameError, setCompanyNameError] = useState('');
    const [contactNumberError, setContactNumberError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [imageFileError, setImageFileError] = useState('');

    const validateForm = () => {
        let isValid = true;

        isValid = isValid && validateEmail(email);
        isValid = isValid && validateCompanyName(companyName);
        isValid = isValid && validateContactNumber(contactNumber);
        isValid = isValid && validateAddress(address);
        isValid = isValid && validateImage(imageFile);

        return isValid;
    };

    const validateEmail = (value) => {
        // You can add email validation logic here if needed
        if (!value.trim()) {
            setEmailError('Email is required');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    const validateCompanyName = (value) => {
        if (!value.trim()) {
            setCompanyNameError('Company name is required');
            return false;
        } else {
            setCompanyNameError('');
            return true;
        }
    };

    const validateContactNumber = (value) => {
        if (!value.trim()) {
            setContactNumberError('Contact number is required');
            return false;
        } else {
            setContactNumberError('');
            return true;
        }
    };

    const validateAddress = (value) => {
        if (!value.trim()) {
            setAddressError('Address is required');
            return false;
        } else {
            setAddressError('');
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

    const handleSave = async () => {
        if (validateForm()) {
            setLoading(true);

            try {
                const formData = new FormData();
                formData.append('Email', email);
                formData.append('CompanyName', companyName);
                formData.append('ContactNumber', contactNumber);
                formData.append('Address', address);
                formData.append('ImageFile', imageFile);

                // Log the data before sending
                for (var pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }

                const response = await fetch('https://localhost:7092/api/DeliveryCompany/CreateDeliveryCompany', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    toast.success('Delivery company created successfully');
                    // Additional logic or navigation can be added here
                } else {
                    console.error('Delivery company creation failed:', response.statusText);
                    toast.error('Delivery company creation failed');
                }
            } catch (error) {
                console.error('Delivery company creation failed:', error);
                toast.error('Delivery company creation failed');
            } finally {
                setLoading(false);
            }
        } else {
            toast.error('Please fill in all required fields and correct validation errors.');
        }
    };


    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    return (
        <div className='PageSetup'>
            <AdminNavbar />
            <div className="outerSetup" maxWidth="550px" width="100%">
                <div style={{ display: 'flex' }}>

                    <div className="image-box">
                        <img src="img/test.png" alt="Delivery Company" />
                    </div>
                    <div className="main-content">
                        <br />
                        <br />
                        <div className="add-delivery-company-container">
                            <div className="add-delivery-company-panel">
                                <Typography variant="h5" className="add-delivery-company-header">
                                    Add Delivery Company
                                </Typography>
                                <div className="add-delivery-company-inputs">
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={Boolean(emailError)}
                                        helperText={emailError}
                                    />
                                    <TextField
                                        label="Company Name"
                                        variant="outlined"
                                        fullWidth
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        error={Boolean(companyNameError)}
                                        helperText={companyNameError}
                                    />
                                    <TextField
                                        label="Contact Number"
                                        variant="outlined"
                                        fullWidth
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        error={Boolean(contactNumberError)}
                                        helperText={contactNumberError}
                                    />
                                    <TextField
                                        label="Address"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        error={Boolean(addressError)}
                                        helperText={addressError}
                                    />

                                    <input
                                        accept="image/jpeg, image/jpg, image/png"
                                        style={{ display: 'none' }}
                                        id="image-file-input"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="image-file-input">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            fullWidth
                                            style={{ height: '55px' }}
                                            startIcon={<InputAdornment position="start">📷</InputAdornment>}
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
                                <div className="add-delivery-company-submit-container">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="add-delivery-company-submit"
                                        onClick={handleSave}
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Submit'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <br />
            </div>
            <Footer />
        </div>
    );
};

export default AddDeliveryCompany;
