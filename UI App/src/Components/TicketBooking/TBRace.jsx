import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';

const TBRace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [races, setRaces] = useState(null);

  useEffect(() => {
    const fetchRacesBySeason = async () => {
      try {
        const response = await axios.get(`https://localhost:7092/api/Race/GetRaceBySeason?seasonId=${state.seasonId}`);
        const fetchedRaces = response.data;
        setRaces(fetchedRaces);
      } catch (error) {
        console.error('Error fetching races:', error);
      }
    };

    if (state && state.seasonId) {
      fetchRacesBySeason();
    }
  }, [state]);

  const handleRaceClick = (raceId) => {
    // Navigate to the TBCorner page and pass the raceId in the state
    navigate('/TBCorner', { replace: true, state: { seasonId: state.seasonId, raceId } });
  };

  if (!races) {
    return <p>No races available for the selected season.</p>;
  }

  return (
    <div>
      <UserNavbar />
      <h1>Race Details for Season - {state.seasonId}</h1>
      <div className="driver-list-container">
        {races.map(race => (
          <div key={race.raceId} className="driver-item" onClick={() => handleRaceClick(race.raceId)}>
            <img src={`https://localhost:7092/images/${race.imagePath}`} alt={`Race ${race.raceName} Image`} className="driver-image" />
            <h2>{`Race - ${race.raceName}`}</h2>
            <p>{`Date: ${new Date(race.raceDate).toLocaleDateString()}`}</p>
            <p>{`Location: ${race.raceLocation}`}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default TBRace;
