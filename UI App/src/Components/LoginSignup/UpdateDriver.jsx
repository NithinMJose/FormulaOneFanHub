import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const UpdateDriver = () => {
  const { driverId } = useParams();
  const [driverData, setDriverData] = useState({
    name: '',
    dob: '',
    description: '',
    imagePath: '',
  });

  const [editableField, setEditableField] = useState('');

  useEffect(() => {
    // Fetch driver data based on driverId
    axios
      .get(`https://localhost:7092/api/Driver/GetDriverById?id=${driverId}`)
      .then((response) => {
        setDriverData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching driver data:', error);
        // Handle the error as needed
      });
  }, [driverId]);

  // Function to format date to display only the date part
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Invalid date string, return empty string
        return '';
      }
      return date.toISOString().split('T')[0]; // Get only the date part
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Function to handle the "Edit" button click
  const handleEditClick = (field) => {
    // Add your logic to handle the "Edit" click, e.g., show editable field
    console.log(`Edit clicked for ${field} in driver ID:`, driverId);
    setEditableField(field);
  };

  // Function to handle changes in editable field
  const handleFieldChange = (value) => {
    setDriverData((prevData) => ({ ...prevData, [editableField]: value }));
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    // Add logic to handle the file upload
    console.log('Image uploaded:', file);
  };

  // Function to update driver data
  const handleUpdateClick = () => {
    const formData = new FormData();
    formData.append('id', driverId);
    formData.append('name', driverData.name);
    formData.append('dob', driverData.dob);
    formData.append('description', driverData.description);
  
    // Append image file only if it's selected
    if (driverData.imageFile) {
      formData.append('imageFile', driverData.imageFile);
    }
  
    // Send a PUT request to update the data in the backend
    axios
      .put(`https://localhost:7092/api/Driver/UpdateDriver`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Update successful:', response);
        // You may want to handle success, e.g., show a success message
      })
      .catch((error) => {
        console.error('Error updating driver data:', error);
        // Handle the error as needed
      });
  };
  

  return (
    <div>
      <AdminNavbar />
      <h1>Driver Details</h1>
      <table>
        <tbody>
          <tr>
            <td>Driver Name</td>
            <td>
              {editableField === 'name' ? (
                <input
                  type="text"
                  value={driverData.name}
                  onChange={(e) => handleFieldChange(e.target.value)}
                />
              ) : (
                driverData.name
              )}
            </td>
            <td>
              {editableField === 'name' && (
                <button onClick={() => setEditableField('')}>Update</button>
              )}
              {editableField !== 'name' && (
                <button onClick={() => handleEditClick('name')}>Edit</button>
              )}
            </td>
          </tr>
          <tr>
            <td>Date of Birth</td>
            <td>
              {editableField === 'dob' ? (
                <input
                  type="date"
                  value={driverData.dob}
                  onChange={(e) => handleFieldChange(e.target.value)}
                />
              ) : (
                formatDate(driverData.dob)
              )}
            </td>
            <td>
              {editableField === 'dob' && (
                <button onClick={() => setEditableField('')}>Update</button>
              )}
              {editableField !== 'dob' && (
                <button onClick={() => handleEditClick('dob')}>Edit</button>
              )}
            </td>
          </tr>
          <tr>
            <td>Description</td>
            <td>
              {editableField === 'description' ? (
                <input
                  type="text"
                  value={driverData.description}
                  onChange={(e) => handleFieldChange(e.target.value)}
                />
              ) : (
                driverData.description
              )}
            </td>
            <td>
              {editableField === 'description' && (
                <button onClick={() => setEditableField('')}>Update</button>
              )}
              {editableField !== 'description' && (
                <button onClick={() => handleEditClick('description')}>Edit</button>
              )}
            </td>
          </tr>
          <tr>
            <td>Existing Image</td>
            <td>
              {editableField === 'imagePath' ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              ) : (
                driverData.imagePath && (
                  <img
                    src={`https://localhost:7092/images/${driverData.imagePath}`}
                    alt={`Image for ${driverData.name}`}
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                )
              )}
            </td>
            <td>
              {editableField === 'imagePath' && (
                <button onClick={() => setEditableField('')}>Update</button>
              )}
              {editableField !== 'imagePath' && (
                <button onClick={() => handleEditClick('imagePath')}>Edit</button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleUpdateClick}>Update All</button>
    </div>
  );
};

export default UpdateDriver;
