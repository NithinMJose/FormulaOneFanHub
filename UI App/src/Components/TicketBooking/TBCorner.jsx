// TBCorner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Footer from '../LoginSignup/Footer';
import UserNavbar from '../LoginSignup/UserNavbar';
import { BASE_URL } from '../../config';

const TBCorner = () => {
  const location = useLocation();
  const { uniqueRaceName } = useParams();
  const { state } = location;
  const [corners, setCorners] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState(1);
  const navigate = useNavigate();
  console.log('Unique Race Name:', uniqueRaceName);

  useEffect(() => {
    const fetchCornersByRace = async () => {
      try {
        const raceResponse = await axios.get(`${BASE_URL}/api/Race/GetRaceIdByUniqueRaceName?uniqueRaceName=${uniqueRaceName}`);
        const raceId = raceResponse.data;
        console.log('Fetched Race ID:', raceId);

        const response = await axios.get(`${BASE_URL}/api/Corner/GetCornerByRace?raceId=${raceId}`);
        const fetchedCorners = response.data;
        setCorners(fetchedCorners);
        console.log('Fetched Corner Data:', fetchedCorners);
      } catch (error) {
        console.error('Error fetching corners:', error);
      }
    };
    
    fetchCornersByRace();
  }, [uniqueRaceName]);

  const handleCornerClick = (cornerId) => {
    // Navigate to the TBCategory page and pass the necessary ids and selected tickets in the state
    navigate(`/TBCategory/${uniqueRaceName}`, { replace: true, state: { cornerId, selectedTickets } });
  };

  const handleTicketsChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedTickets(selectedValue);
  };

  if (!corners) {
    return <p>No corners available for the selected race.</p>;
  }

  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <br />
      <br />
      <h1>Corner Details for Race - {uniqueRaceName}</h1>
      <div>
        <label htmlFor="tickets" style={styles.label}>
          Select the number of tickets:
        </label>
        <select id="tickets" value={selectedTickets} onChange={handleTicketsChange} style={styles.select}>
          {/* You can customize the number of available tickets based on your requirement */}
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div className="driver-list-container">
        {corners.map((corner) => (
          <div key={corner.cornerId} className="driver-item" onClick={() => handleCornerClick(corner.cornerId)}>
            {/* Display corner details including AvailableCapacity */}
            <h2>{`Corner - ${corner.cornerNumber}`}</h2>
            <p>{`Capacity: ${corner.cornerCapacity}`}</p>
            <p>{`Available Seats: ${corner.availableCapacity}`}</p>
            {/* Add more corner details as needed */}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  label: {
    fontSize: '1.2rem',
    marginBottom: '8px', // Add some space below the label
  },
  select: {
    fontSize: '1.2rem',
    padding: '8px',
    borderRadius: '5px',
  },
};

export default TBCorner;
