import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdateDriver.css';
import Footer from './Footer';


const UpdateDriver = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { driverId } = useParams();
  const [driverData, setDriverData] = useState({
    name: '',
    dob: '',
    description: '',
    imagePath: '',
    imageFile: null,
  });

  const [editableField, setEditableField] = useState('');

  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/Driver/GetDriverById?id=${driverId}`)
      .then((response) => {
        setDriverData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching driver data:', error);
      });
  }, [driverId]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleEditClick = (field) => {
    console.log(`Edit clicked for ${field} in driver ID:`, driverId);
    setEditableField(field);
  };

  const handleFieldChange = (value) => {
    setDriverData((prevData) => ({ ...prevData, [editableField]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setDriverData((prevData) => ({
      ...prevData,
      imageFile: file,
      imagePath: URL.createObjectURL(file), // Create a temporary URL for the selected image
    }));
  };

  const handleUpdateClick = () => {
    // Basic validations
    if (!driverData.name || !driverData.dob || !driverData.description ) {
      // Log empty fields to the console
      console.log('Empty Fields:', {
        name: !driverData.name,
        dob: !driverData.dob,
        description: !driverData.description,
      });
  
      toast.error('All fields are required');
      return;
    }
  
    // Additional date validations
    const currentDate = new Date();
    const selectedDate = new Date(driverData.dob);
  
    if (selectedDate > currentDate) {
      toast.error('Date of Birth cannot be a future date');
      return;
    }
  
    const minValidDate = new Date('1600-01-01');
    if (selectedDate < minValidDate) {
      toast.error('Date of Birth must be on or after January 1, 1600');
      return;
    }
  
    // Name field validations
    if (driverData.name.length < 3) {
      toast.error('Name field requires at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(driverData.name)) {
      toast.error('Only alphabets and white spaces are allowed for Name');
      return;
    }

    if (driverData.description.length < 10) {
      toast.error('Description field requires at least 10 characters');
      return;
    }

    if (driverData.imageFile) {
      const allowedFormats = ['image/png', 'image/jpeg'];
      if (!allowedFormats.includes(driverData.imageFile.type)) {
        toast.error('Image file must be in PNG or JPEG format');
        return;
      }
    }
  
    const formData = new FormData();
    formData.append('id', driverId);
    formData.append('name', driverData.name);
    formData.append('dob', driverData.dob);
    formData.append('description', driverData.description);
  
    if (driverData.imageFile) {
      formData.append('imageFile', driverData.imageFile);
    }
  
    axios
      .put(`https://localhost:7092/api/Driver/UpdateDriver`, formData)
      .then((response) => {
        console.log('Update successful:', response);
        toast.success('Update successful');
        navigate('/DriverList');
      })
      .catch((error) => {
        console.error('Error updating driver data:', error);
        toast.error('Error updating driver data');
      });
  };
  
  

  return (
    <div>
      <AdminNavbar />
      <div className='updatedriverwrapper'>
        <h1 className="headingUpdateDriver">Driver Details</h1>
        <div className="fullContainer">
          <table>
            <tbody>
              <tr>
                <td className="attribute">Driver Name</td>
                <td>
                  {editableField === 'name' ? (
                    <input
                      type="text"
                      value={driverData.name}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      className="inputField"
                    />
                  ) : (
                    <div className="value">{driverData.name}</div>
                  )}
                </td>
                <td>
                  {editableField === 'name' ? (
                    <button className="updateButton" onClick={() => setEditableField('')}>
                      Update
                    </button>
                  ) : (
                    <button className="editButton" onClick={() => handleEditClick('name')}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="attribute">Date of Birth</td>
                <td>
                  {editableField === 'dob' ? (
                    <input
                      type="date"
                      value={driverData.dob}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      className="inputField"
                    />
                  ) : (
                    <div className="value">{formatDate(driverData.dob)}</div>
                  )}
                </td>
                <td>
                  {editableField === 'dob' ? (
                    <button className="updateButton" onClick={() => setEditableField('')}>
                      Update
                    </button>
                  ) : (
                    <button className="editButton" onClick={() => handleEditClick('dob')}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="attribute">Description</td>
                <td>
                  {editableField === 'description' ? (
                    <input
                      type="text"
                      value={driverData.description}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      className="inputField"
                    />
                  ) : (
                    <div className="value">{driverData.description}</div>
                  )}
                </td>
                <td>
                  {editableField === 'description' ? (
                    <button className="updateButton" onClick={() => setEditableField('')}>
                      Update
                    </button>
                  ) : (
                    <button className="editButton" onClick={() => handleEditClick('description')}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="attribute">Existing Image</td>
                <td>
                  {editableField === 'imagePath' ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="inputField"
                    />
                  ) : (
                    <div>
                      {driverData.imageFile ? (
                        <img
                          src={driverData.imagePath}
                          alt={`Image preview`}
                          className="image-preview"
                        />
                      ) : (
                        <img
                          src={`https://localhost:7092/images/${driverData.imagePath}`}
                          alt={`Image for ${driverData.name}`}
                          className="image-preview"
                        />
                      )}
                    </div>
                  )}
                </td>
                <td>
                  {editableField === 'imagePath' ? (
                    <button className="updateButton" onClick={() => setEditableField('')}>
                      Update
                    </button>
                  ) : (
                    <button className="editButton" onClick={() => handleEditClick('imagePath')}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p></p>
        <p></p>
        <br></br>
        <button className="applyButton" onClick={handleUpdateClick}>
          Apply the changes to db
        </button>
      </div>
      <p></p>
      <p></p>          
      <Footer/>
    </div>
  );
};

export default UpdateDriver;