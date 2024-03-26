import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, styled } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import axios from 'axios';
import Footer from '../LoginSignup/Footer';
import './GalleryListAdmin.css';

const StyledTableContainer = styled(TableContainer)`
  margin-top: 20px;
`;

const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const StyledImage = styled('img')`
  max-width: 100%;
  max-height: 100%;
  width: 150px;
  height: 150px;
`;

const StyledButton = styled(Button)`
  background-color: #2196f3;
  color: #fff;

  &:hover {
    background-color: #1565c0;
  }
`;

const GalleryListAdmin = () => {
  const navigate = useNavigate();
  const [galleryData, setGalleryData] = useState(null);
  const [uniqueName, setUniqueName] = useState('');

  useEffect(() => {
    axios
      .get('https://localhost:7092/api/Gallery/GetAllImages')
      .then((response) => {
        const filteredData = response.data.filter(image => image.isActive === "Yes");
        setGalleryData(filteredData);
      })
      .catch((error) => {
        console.error('Error fetching gallery data:', error);
        toast.error('An error occurred while fetching gallery data');
      });
  }, []);

  const renderGalleryData = () => {
    if (!galleryData) {
      return <p>Loading gallery data...</p>;
    }

    return (
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <TableCell style={{ width: '5%' }}>Sl No.</TableCell>
              <TableCell style={{ width: '50%' }}>Image</TableCell>
              <TableCell style={{ width: '30%' }}>Caption</TableCell>
              <TableCell style={{ width: '15%' }}>Actions</TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {galleryData.map((image, index) => (
              <StyledTableRow key={image.imageId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <StyledImage
                    src={`https://localhost:7092/images/${image.imageUrl}`}
                    alt={`Image for ${image.caption}`}
                  />
                </TableCell>
                <TableCell>{image.caption}</TableCell>
                <TableCell>
                  <StyledButton variant="contained" onClick={() => handleEditImage(image.uniqueName)}>Edit</StyledButton>
                  <StyledButton variant="contained" onClick={() => handleRemoveImage(image.uniqueName)}>Remove</StyledButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    );
  };

  const handleEditImage = (uniqueName) => {
    console.log('Unique Name:', uniqueName);
    navigate(`/EditGallery/${uniqueName}`);
  };

  const handleRemoveImage = (uniqueName) => {
    axios.delete(`https://localhost:7092/api/Gallery/DeleteImage?uniqueName=${uniqueName}`)
      .then(response => {
        console.log("Image removed successfully.");
        window.location.reload(); // Reload the page after successful removal
      })
      .catch(error => {
        console.error('Error removing image:', error);
        toast.error('An error occurred while removing the image');
      });
  };



  return (
    <div className="gallerylistadminpage">
      <AdminNavbar />
      <br />
      <div className='containerss'>
        {renderGalleryData()}
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default GalleryListAdmin;
