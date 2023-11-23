import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import { InputAdornment, TextField, Grid, Card, CardContent, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const TBRace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [races, setRaces] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRaces = races
  ? races.filter(
      (race) =>
        race.raceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.raceLocation.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  return (
    <div>
      <UserNavbar />
      <br />
      <h1>Select Your Race For the Season</h1>

      {/* Search Bar */}
      <TextField
        label="Search Race"
        variant="outlined"
        size="small"
        sx={{ mb: 2, width: '20%' }} // Adjusted width and moved to the right
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Display Races in a Responsive Grid */}
      <Grid container spacing={2} justifyContent="center">
        {filteredRaces.map(race => (
          <Grid item key={race.raceId} xs={12} sm={6} md={3} lg={3} sx={{ margin: '8px' }}>
            {/* Reduced the width */}
            <Card onClick={() => handleRaceClick(race.raceId)} sx={{ cursor: 'pointer', height: '100%', width: '90%' }}>
              <img
                src={`https://localhost:7092/images/${race.imagePath}`}
                alt={`Race ${race.raceName} Image`}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6">{`Race - ${race.raceName}`}</Typography>
                <Typography>{`Date: ${new Date(race.raceDate).toLocaleDateString()}`}</Typography>
                <Typography>{`Location: ${race.raceLocation}`}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Footer />
    </div>
  );
};

export default TBRace;
