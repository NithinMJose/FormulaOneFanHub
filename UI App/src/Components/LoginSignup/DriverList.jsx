// DriverList.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';
import './DriverList.css'; // Make sure to include your DriverList.css file
import Footer from './Footer';
import jwt_decode from 'jwt-decode';

const DriverList = () => {
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      const tokenPayload = jwt_decode(token);
      const roleId = tokenPayload['RoleId'];

      if (roleId !== 'Admin') {
        toast.error('You have to be logged in as Admin to access the page');
        navigate('/');
        return;
      }

      axios
        .get(`https://localhost:7092/api/Driver/GetDrivers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setDriverData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching driver data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            // You might want to redirect to the login page here
            navigate('/');
          } else {
            toast.error('An error occurred while fetching driver data');
          }
        });
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const handleManageDriver = (driverId) => {
    // Redirect to the UpdateDriver page with the specific driverId
    navigate(`/UpdateDriver/${driverId}`);
  };

  const renderDriverData = () => {
    if (!driverData) {
      return <p>Loading driver data...</p>;
    }

    return (
      <div className="driver-container">
        <div className="driver-content">
          <h1 className="driver-heading">Driver List</h1>
          <div className="table-responsive">
            <table className="driver-table">
              <thead>
                <tr>
                  <th className="driver-heading-bg">Driver Name</th>
                  <th className="driver-heading-bg">Date of Birth</th>
                  <th className="driver-heading-bg">Description</th>
                  <th className="driver-heading-bg">Image</th>
                  <th className="driver-heading-bg">Manage</th>
                </tr>
              </thead>
              <tbody>
                {driverData.map((driver) => (
                  <tr key={driver.driverId}>
                    <td>{driver.name}</td>
                    <td>{driver.dob}</td>
                    <td>{driver.description}</td>
                    <td>
                      {driver.imagePath ? (
                        <img
                          src={`https://localhost:7092/images/${driver.imagePath}`}
                          alt={`Image for ${driver.name}`}
                          className="driver-image"
                          onLoad={() => console.log(`Image loaded for ${driver.name}: ${driver.imagePath}`)}
                          onError={() => console.error(`Error loading image for ${driver.name}: ${driver.imagePath}`)}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="driver-buttons">
                      <button
                        className="btn btn-primary btn-edit"
                        onClick={() => handleManageDriver(driver.driverId)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <AdminNavbar />
      <br />
      <br />
      {renderDriverData()}
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default DriverList;
