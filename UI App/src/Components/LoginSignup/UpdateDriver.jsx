import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateDriver = () => {
  const { driverId } = useParams();
  const [driverData, setDriverData] = useState({
    name: '',
    dob: '',
    description: '',
    imagePath: '',
    imageFile: null, // Added to store the selected image file
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
    // Update the imageFile in the state
    setDriverData((prevData) => ({ ...prevData, imageFile: file }));
  };

  // Function to update driver data
  const handleUpdateClick = () => {
    // Create a FormData object to send data to the server
    const formData = new FormData();
  
    // Append the driverId to the form data
    formData.append('id', driverId);
  
    // Append the updated driver data to the form data
    formData.append('name', driverData.name);
    formData.append('dob', driverData.dob);
    formData.append('description', driverData.description);
  
    // Append the image file only if it's selected
    if (driverData.imageFile) {
      formData.append('imageFile', driverData.imageFile);
    }
  
    // Send a PUT request to update the data in the backend
    axios
      .put(`https://localhost:7092/api/Driver/UpdateDriver`, formData)
      .then((response) => {
        console.log('Update successful:', response);
        // You may want to handle success, e.g., show a success message
        toast.success('Update successful');
      })
      .catch((error) => {
        console.error('Error updating driver data:', error);
        // Handle the error as needed
        toast.error('Error updating driver data');
      });
  };
  
  return (
    <div>
      <AdminNavbar />
      
      <h1 style={{ paddingTop: '10px' }}>Driver Details</h1>
      <div className="fullContainer">
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
      </div>
      <button onClick={handleUpdateClick}>Apply the changes to db</button>
    </div>
  );
};

export default UpdateDriver;
