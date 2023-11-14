// TBCorner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const TBCorner = () => {
  const location = useLocation();
  const { state } = location;
  const [corners, setCorners] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCornersByRace = async () => {
      try {
        const response = await axios.get(`https://localhost:7092/api/Corner/GetCornerByRace?raceId=${state.raceId}`);
        const fetchedCorners = response.data;
        setCorners(fetchedCorners);
      } catch (error) {
        console.error('Error fetching corners:', error);
      }
    };

    if (state && state.raceId) {
      fetchCornersByRace();
    }
  }, [state]);

  const handleCornerClick = (cornerId) => {
    // Navigate to the TBTicketCategory page and pass the necessary ids in the state
    navigate('/TBCategory', { replace: true, state: { seasonId: state.seasonId, raceId: state.raceId, cornerId } });
  };

  if (!corners) {
    return <p>No corners available for the selected race.</p>;
  }

  return (
    <div>
      <h1>Corner Details for Race - {state.raceId}</h1>
      <div className="driver-list-container">
        {corners.map(corner => (
          <div key={corner.cornerId} className="driver-item" onClick={() => handleCornerClick(corner.cornerId)}>
            {/* Display corner details as needed */}
            <h2>{`Corner - ${corner.cornerNumber}`}</h2>
            <p>{`Capacity: ${corner.cornerCapacity}`}</p>
            {/* Add more corner details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TBCorner;
