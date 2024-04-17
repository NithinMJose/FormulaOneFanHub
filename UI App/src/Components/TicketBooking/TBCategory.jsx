// TBCategory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const TBCategory = () => {
  const location = useLocation();
  const { state } = location;
  const [ticketCategories, setTicketCategories] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketCategories = async () => {
      try {
        const cornerId = state.cornerId;
        const selectedTickets = state.selectedTickets;
        console.log('Corner Id:', cornerId);
        console.log('Selected Tickets:', selectedTickets);

        // use the endpoint 
        const response = await axios.get(`${BASE_URL}/api/TicketCategory/GetAllTicketCategories`);
        const data = response.data;
        console.log('Fetched Ticket Categories:', data);
        setTicketCategories(data);
      } catch (error) {
        console.error('Error fetching ticket categories:', error);
      }
    };

    fetchTicketCategories();
  }, []);

  const handleCategoryClick = (ticketCategoryId, ticketPrice) => {
    // Log the data received from TBCategory and the selected ticketCategoryId
    console.log('Data received from TBCategory:', state);
    const cornerId = state.cornerId;
    console.log(' Corner Id :', cornerId);
    console.log('Selected TicketCategoryId:', ticketCategoryId);
    console.log('Selected TicketPrice:', ticketPrice);
    console.log('Selected Tickets:', state.selectedTickets);
    const selectedTickets = state.selectedTickets;

    // Navigate to the TBConfirm page and pass the necessary values
    navigate('/TBConfirm', { replace: true, state: { cornerId, selectedTickets, ticketCategoryId, ticketPrice } });
  };

  if (!ticketCategories) {
    return <p>No ticket categories available.</p>;
  }

  return (
    <div>
    <UserNavbar />
    <br />
    <br />
    <br />
    <br />
      <h1>Ticket Categories</h1>
      <div className="driver-list-container">
        {ticketCategories.map(category => (
          <div key={category.ticketCategoryId} className="driver-item" onClick={() => handleCategoryClick(category.ticketCategoryId, category.ticketPrice)}>
            <img src={`${BASE_URL}/images/${category.imagePath}`} alt={`Category ${category.categoryName} Image`} className="driver-image" />
            {/* Display ticket category details as needed */}
            <h2>{`Category - ${category.categoryName}`}</h2>
            <p>{`Description: ${category.description || 'N/A'}`}</p>
            <p>{`Ticket Price: ${category.ticketPrice}`}</p>
            {/* Add more ticket category details as needed */}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default TBCategory;
