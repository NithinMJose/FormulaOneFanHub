import React, { useState, useEffect } from 'react';
import './DriverListUser.css';
import UserNavbar from '../LoginSignup/UserNavbar';
import { BASE_URL } from '../../config';

const DriverListUser = () => {
  const [driverList, setDriverList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/Driver/GetDrivers`);
        const data = await response.json();
        setDriverList(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <UserNavbar />
      <div className="driver-list-container" style={{ marginTop: "100px" }}>
        {driverList.map((driver) => (
          <div key={driver.driverId} className="driver-item">
            <img
              src={`https://localhost:7092/images/${driver.imagePath}`} 
              alt={`${driver.name}'s Image`}
              className="driver-image"
            />
            <h2 className="driver-name">{driver.name}</h2>
            <p className="driver-details">
            {driver.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverListUser;
