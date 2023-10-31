// Import necessary dependencies and components
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import axios from 'axios';
import './UpdateDriver.css'; // Make sure to include the CSS file for styling
import Footer from './Footer';

const UpdateDriver = () => {
  // State variables
  const navigate = useNavigate();
  const { id } = useParams();
  const [driverData, setDriverData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    dob: '',
    description: '',
  });

  // UseEffect hook
  useEffect(() => {
    // Fetch driver data by ID
    axios
      .get(`https://localhost:7092/api/Driver/GetDriverById?id=${id}`)
      .then((response) => {
        setDriverData(response.data);
        setEditedData({ ...response.data });
      })
      .catch((error) => {
        console.error('Error fetching driver data:', error);
        toast.error('An error occurred while fetching driver data');
        navigate('/'); // Redirect to the home page on error
      });
  }, [id, navigate]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle update driver function
  const handleUpdateDriver = () => {
    // Validate data before sending to the backend (you can add more validation if needed)
    if (!editedData.name || !editedData.dob || !editedData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    // Create a payload with the updated data
    const updatePayload = {
      name: editedData.name,
      dob: editedData.dob,
      description: editedData.description,
    };

    // Implement the logic to update the driver's profile here
    axios
      .put(`https://localhost:7092/api/Driver/UpdateDriver?id=${id}`, updatePayload)
      .then((response) => {
        toast.success('Driver updated successfully');
        setIsEditing(false);

        // Refresh driver data after updating
        axios
          .get(`https://localhost:7092/api/Driver/GetDriverById?id=${id}`)
          .then((response) => {
            setDriverData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching updated driver data:', error);
            toast.error('An error occurred while fetching updated driver data');
          });
      })
      .catch((error) => {
        console.error('Error updating driver:', error);
        toast.error('An error occurred while updating driver');
      });
  };

  // Render driver data function
  const renderDriverData = () => {
    if (!driverData) {
      return <p>Loading driver data...</p>;
    }

    return (
      <div>
        <h1 className="headingUpdateDriver">Driver Details</h1>
        <table>
          <tbody>
            <tr>
              <td className="attribute">Name</td>
              <td className="data">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{driverData.name}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="attribute">Date of Birth</td>
              <td className="data">
                {isEditing ? (
                  <input
                    type="text"
                    name="dob"
                    value={editedData.dob}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{driverData.dob}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="attribute">Description</td>
              <td className="data">
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editedData.description}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{driverData.description}</span>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="edit">
                {isEditing ? (
                  <button className="updateButton" onClick={handleUpdateDriver}>
                    Update Driver
                  </button>
                ) : (
                  <button className="editButton" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Return JSX
  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <div className="container">{renderDriverData()}</div>
      <br />
      <Footer />
    </div>
  );
};

export default UpdateDriver;
