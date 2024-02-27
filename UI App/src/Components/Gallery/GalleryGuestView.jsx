import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, styled, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '../LoginSignup/Footer';
import HomeNavbar from '../LoginSignup/HomeNavbar';

const StyledContainer = styled(Container)`
  margin-top: 20px;
`;

const StyledCard = styled(Card)`
  max-width: 300px;
  margin: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledCardMedia = styled(CardMedia)`
  height: 200px; /* Set a fixed height for all images */
  cursor: pointer;
`;

const GalleryGuestView = () => {
  const [galleryList, setGalleryList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7092/api/Gallery/GetAllImages');
        const data = await response.json();
        setGalleryList(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
    setDialogOpen(false);
  };

  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      <br />
      <br />
      <StyledContainer>
        <Typography variant="h4" align="center" gutterBottom>
          Gallery
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {galleryList.map((image) => (
            <StyledCard key={image.imageId}>
              <StyledCardMedia
                component="img"
                alt={image.caption}
                height="200" // Set a fixed height for all images
                image={`https://localhost:7092/images/${image.imageUrl}`}
                onClick={() => handleImageClick(image)}
              />
              <CardContent>
                <Typography variant="h6" component="div" align="center">
                  {image.caption}
                </Typography>
              </CardContent>
            </StyledCard>
          ))}
        </div>
      </StyledContainer>

      {/* Image Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xl">
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={`https://localhost:7092/images/${selectedImage.imageUrl}`}
              alt={selectedImage.caption}
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Footer />
      <br />
    </div>
  );
};

export default GalleryGuestView;
