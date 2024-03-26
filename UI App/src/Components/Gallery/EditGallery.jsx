import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField, Typography, Container, Paper, Grid } from '@mui/material';
import Footer from '../LoginSignup/Footer';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import { useNavigate, useParams } from 'react-router-dom';
import './EditGallery.css';

const EditGallery = () => {
  const { uniqueName } = useParams();
  console.log("Printing uniqueName: ", uniqueName);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [oldImageUrl, setOldImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const [captionError, setCaptionError] = useState('');
  const [imageFileError, setImageFileError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch gallery image data based on uniqueName
    const fetchGalleryData = async () => {
      try {
        console.log("Fetching image data for uniqueName: ", uniqueName);
        const response = await fetch(`https://localhost:7092/api/Gallery/GetGalleryByUniqueName?uniqueName=${uniqueName}`);
        if (response.ok) {
          const data = await response.json();
          setCaption(data.caption); // Set the current caption
          setOldImageUrl(data.imageUrl); // Set the URL of the old image
        } else {
          toast.error('Failed to fetch image data');
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
        toast.error('Failed to fetch image data');
      }
    };

    fetchGalleryData();
  }, [uniqueName]);

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
    if (file && !file.type.match(/image\/(jpeg|jpg|png)/)) {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    validateImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('caption', caption);

        // Check if a new image is selected
        if (imageFile) {
          formData.append('imageFile', imageFile);
        }

        const response = await fetch(`https://localhost:7092/api/Gallery/UpdateImage?uniqueName=${uniqueName}`, {
          method: 'PUT',
          body: formData,
        });

        if (response.ok) {
          toast.success('Image updated successfully');
          navigate('/GalleryListAdmin');
        } else {
          const errorData = await response.json();
          console.error('Image update failed:', errorData);
          toast.error('Image update failed');
        }
      } catch (error) {
        console.error('Image update failed:', error);
        toast.error('Image update failed');
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
      <Container maxWidth="sm" style={{ marginTop: '100px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Edit Gallery Image
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
              <Typography variant="h6" align="center" gutterBottom>
                Old Image
              </Typography>
              <div style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
                <img src={`https://localhost:7092/images/${oldImageUrl}`} alt="Old Image" style={{ width: '100%', height: 'auto' }} />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" align="center" gutterBottom>
                New Image Preview
              </Typography>
              <div style={{ width: '300px', height: '200px', overflow: 'hidden' }}>
                {previewImage && (
                  <img src={previewImage} alt="New Image Preview" style={{ width: '100%', height: 'auto' }} />
                )}
              </div>
            </Grid>

            <Grid item xs={12}>
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
                >
                  Upload New Image
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
                {loading ? 'Updating...' : 'Update Image'}
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

export default EditGallery;
