import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';

const TBSeason = () => {
  const [seasonsData, setSeasonsData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      try {
        const response = await axios.get('https://localhost:7092/api/Season/SeasonsForBooking');
        const fetchedSeasonsData = response.data;

        // Log the structure of fetchedSeasonsData
        console.log('Seasons Data:', fetchedSeasonsData);

        // Check if fetchedSeasonsData.seasons is defined
        if (fetchedSeasonsData.seasons && fetchedSeasonsData.seasons.length > 0) {
          // Set the season data to state
          setSeasonsData(fetchedSeasonsData);
        } else {
          console.error('No seasons array available');
        }
      } catch (error) {
        console.error('Error fetching season details:', error);
      }
    };

    fetchSeasonDetails();
  }, []);

  const handleImageClick = (seasonId) => {
    // Navigate to the TBRace page and pass the season id in the state
    navigate('/TBRace', { replace: true, state: { seasonId } });
  };

  if (!seasonsData) {
    return <p>No season details available.</p>;
  }

  // Adjust the rendering based on your UI design
  return (
    <div>
      <UserNavbar />
      <div className="driver-list-container">
        {seasonsData.seasons.map((season, index) => (
          // Skip rendering if season is null
          season && (
            <div key={index} className="driver-item">
              <img
                src={`https://localhost:7092/images/${season.imagePath}`} 
                alt={`Season ${season.year} Image`}
                className="driver-image"
                onClick={() => handleImageClick(season.seasonId)}
              />
              <h2 className="driver-name">{`Season - ${season.year}`}</h2>
              <p className="driver-details">{`Champion: ${season.champion || 'N/A'}`}</p>
              {/* Add more season details as needed */}
            </div>
          )
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default TBSeason;
