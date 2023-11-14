// TBCategory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const TBCategory = () => {
  const location = useLocation();
  const { state } = location;
  const [ticketCategories, setTicketCategories] = useState(null);

  useEffect(() => {
    const fetchTicketCategories = async () => {
      try {
        const response = await axios.get(`https://localhost:7092/api/TicketCategory/GetAllTicketCategories`);
        const data = response.data;
        setTicketCategories(data);
      } catch (error) {
        console.error('Error fetching ticket categories:', error);
      }
    };

    fetchTicketCategories();
  }, []);

  const handleCategoryClick = (ticketCategoryId) => {
    // Log the data received from TBCategory and the selected ticketCategoryId
    console.log('Data received from TBCategory:', state);
    console.log('Selected TicketCategoryId:', ticketCategoryId);

    // Perform additional actions as needed
  };

  if (!ticketCategories) {
    return <p>No ticket categories available.</p>;
  }

  return (
    <div>
      <h1>Ticket Categories</h1>
      <div className="driver-list-container">
        {ticketCategories.map(category => (
          <div key={category.ticketCategoryId} className="driver-item" onClick={() => handleCategoryClick(category.ticketCategoryId)}>
            {/* Display ticket category details as needed */}
            <h2>{`Category - ${category.categoryName}`}</h2>
            <p>{`Description: ${category.description || 'N/A'}`}</p>
            <p>{`Ticket Price: ${category.ticketPrice}`}</p>
            {/* Add more ticket category details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TBCategory;
