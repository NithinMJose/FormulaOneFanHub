// TicketCategoryList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import axios from 'axios';
import './SeasonList.css'; // Make sure to include your TicketCategoryList.css file
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const TicketCategoryList = () => {
  const navigate = useNavigate();
  const [ticketCategories, setTicketCategories] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      axios
        .get(`${BASE_URL}/api/TicketCategory/GetAllTicketCategories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTicketCategories(response.data);
        })
        .catch((error) => {
          console.error('Error fetching ticket category data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            navigate('/');
          } else {
            toast.error('An error occurred while fetching ticket category data');
          }
        });
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const handleManageTicketCategory = (categoryId) => {
    navigate(`/EditTicketCategory`, { replace: true, state: { categoryId } });
  };

  const renderTicketCategories = () => {
    if (!ticketCategories) {
      return <p>Loading ticket category data...</p>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>Sl No.</TableCell>
              <TableCell style={{ width: '20%' }}>Category Name</TableCell>
              <TableCell style={{ width: '40%' }}>Description</TableCell>
              <TableCell style={{ width: '20%' }}>Ticket Price</TableCell>
              <TableCell style={{ width: '15%' }}>Manage</TableCell>
              <TableCell style={{ width: '15%' }}>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketCategories.map((ticketCategory, index) => (
              <TableRow key={ticketCategory.ticketCategoryId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{ticketCategory.categoryName}</TableCell>
                <TableCell>{ticketCategory.description}</TableCell>
                <TableCell>{ticketCategory.ticketPrice}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManageTicketCategory(ticketCategory.ticketCategoryId)}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  {ticketCategory.imagePath ? (
                    <img
                      src={`${BASE_URL}/images/${ticketCategory.imagePath}`}
                      alt={`Image for ${ticketCategory.categoryName}`}
                      className="category-image"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: '150px', height: '150px' }}
                      onLoad={() => console.log(`Image loaded for ${ticketCategory.categoryName}: ${ticketCategory.imagePath}`)}
                      onError={() => console.error(`Error loading image for ${ticketCategory.categoryName}: ${ticketCategory.imagePath}`)}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="ticket-category-list-page">
      <AdminNavbar />
      <br />
      {renderTicketCategories()}
      <br />
      <Footer />
    </div>
  );
};

export default TicketCategoryList;
