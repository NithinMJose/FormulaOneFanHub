import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField, Typography, Container, InputAdornment, Paper, Grid } from '@mui/material';
import Footer from '../LoginSignup/Footer';
import AdminNavbar from '../LoginSignup/AdminNavbar';

const AddGallery = () => {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [captionError, setCaptionError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

  const validateCaption = (value) => {
    if (!value.trim()) {
      setCaptionError('Caption is required');
      return false;
    } else {
      setCaptionError('');
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

    isValid = isValid && validateCaption(caption);
    isValid = isValid && validateImage(imageFile);

    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('imageFile', imageFile);

        const response = await fetch('https://localhost:7092/api/Gallery/UploadImage', {
          method: 'POST',
          body: formData,
        });

        if (response.status === 201) {
          toast.success('Image uploaded successfully');
          // Additional logic or navigation can be added here
        } else {
          const errorData = await response.json();
          console.error('Image upload failed:', errorData);
          toast.error('Image upload failed');
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('Image upload failed');
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
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add Gallery Image
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Caption"
                variant="outlined"
                fullWidth
                value={caption}
                onChange={(e) => {
                  setCaption(e.target.value);
                  validateCaption(e.target.value);
                }}
                error={Boolean(captionError)}
                helperText={captionError}
              />
            </Grid>
            <Grid item xs={12}>
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
                  startIcon={<InputAdornment position="start">📷</InputAdornment>}
                >
                  Upload Image
                </Button>
              </label>
              {imageFileError && (
                <Typography variant="caption" color="error" style={{ marginTop: '8px' }}>
                  {imageFileError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <br />
      <Footer />
    </div>
  );
};

export default AddGallery;
