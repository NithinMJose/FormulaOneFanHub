import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode'; // Import jwt-decode library

const UpdateTeam = () => {
  const [teamData, setTeamData] = useState({
    name: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    address3: '',
    country: '',
    teamPrincipal: '',
    technicalChief: '',
    engineSupplier: '',
    chassis: ''
  });

  useEffect(() => {
    // Fetch JWT token from local storage (assuming it's stored there after login)
    const token = localStorage.getItem('jwtToken');

    // Decode the token to access payload data
    const decodedToken = jwt_decode(token);

    // Extract TeamId from the decoded token payload
    const teamId = decodedToken.teamId;

    // Use the teamId to fetch team data
    axios.get(`https://localhost:7092/api/Team/GetTeamById?id=${teamId}`)
      .then(response => {
        setTeamData(response.data);
      })
      .catch(error => {
        console.error('Error fetching team data:', error);
      });
  }, []);

  const handleFieldChange = (field, value) => {
    setTeamData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Fetch JWT token from local storage (assuming it's stored there after login)
    const token = localStorage.getItem('jwtToken');

    // Decode the token to access payload data
    const decodedToken = jwt_decode(token);

    // Extract TeamId from the decoded token payload
    const teamId = decodedToken.teamId;

    axios.put(`https://localhost:7092/api/Team/UpdateTeam?id=${teamId}`, teamData)
      .then(response => {
        console.log('Team updated successfully:', response);
        // Redirect to team list page after successful update
        window.location.href = '/TeamList';
      })
      .catch(error => {
        console.error('Error updating team:', error);
      });
  };

  return (
    <div>
      <h1>Update Team</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields for updating team information */}
        <input type="text" value={teamData.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
        <input type="text" value={teamData.phoneNumber} onChange={(e) => handleFieldChange('phoneNumber', e.target.value)} />
        <input type="text" value={teamData.address1} onChange={(e) => handleFieldChange('address1', e.target.value)} />
        <input type="text" value={teamData.address2} onChange={(e) => handleFieldChange('address2', e.target.value)} />
        <input type="text" value={teamData.address3} onChange={(e) => handleFieldChange('address3', e.target.value)} />
        <input type="text" value={teamData.country} onChange={(e) => handleFieldChange('country', e.target.value)} />
        <input type="text" value={teamData.teamPrincipal} onChange={(e) => handleFieldChange('teamPrincipal', e.target.value)} />
        <input type="text" value={teamData.technicalChief} onChange={(e) => handleFieldChange('technicalChief', e.target.value)} />
        <input type="text" value={teamData.engineSupplier} onChange={(e) => handleFieldChange('engineSupplier', e.target.value)} />
        <input type="text" value={teamData.chassis} onChange={(e) => handleFieldChange('chassis', e.target.value)} />

        <button type="submit">Update Team</button>
      </form>
    </div>
  );
};

export default UpdateTeam;
