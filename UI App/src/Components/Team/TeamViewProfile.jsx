import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
} from '@mui/material';
import UserNavbar from '../LoginSignup/AdminNavbar';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Footer from '../LoginSignup/Footer';
import TeamSidebar from '../sidebar/TeamSidebar';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';

const TeamViewProfile = () => {
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    address3: '',
    country: '',
    teamPrincipal: '',
    technicalChief: '',
    engineSupplier: '',
    chassis: '',
    imageFile: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      toast.error('You are not authorized to access this page');
      navigate('/Signin');
    } else {
      try {
        const tokenPayload = jwt_decode(token);
        const userName = tokenPayload.userName;

        axios
          .get(`https://localhost:7092/api/Team/GetTeamByUserName?userName=${userName}`)
          .then((response) => {
            setTeamData(response.data);
            setEditedData({ ...response.data });
          })
          .catch((error) => {
            console.error('Error fetching team data:', error);
            toast.error('An error occurred while fetching team data');
          });
      } catch (error) {
        console.error('Error decoding token:', error);
        toast.error('An error occurred while decoding the token');
        navigate('/Signin');
      }
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file || (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
      toast.error('Please upload a valid PNG or JPG image.');
      return;
    }

    setEditedData((prevData) => ({
      ...prevData,
      imageFile: file,
      imagePath: URL.createObjectURL(file),
    }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleUpdateProfile = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      toast.error('You are not authorized to access this page');
      navigate('/Signin');
      return;
    }
    
    const tokenPayload = jwt_decode(token);
    const teamId = tokenPayload.teamId;
    
    // Create a FormData object
    const formData = new FormData();
    
    // Append data fields to the FormData object
    formData.append('name', editedData.name);
    formData.append('phoneNumber', editedData.phoneNumber);
    formData.append('address1', editedData.address1);
    formData.append('address2', editedData.address2);
    formData.append('address3', editedData.address3);
    formData.append('country', editedData.country);
    formData.append('teamPrincipal', editedData.teamPrincipal);
    formData.append('technicalChief', editedData.technicalChief);
    formData.append('engineSupplier', editedData.engineSupplier);
    formData.append('chassis', editedData.chassis);

    if (editedData.imageFile) {
      formData.append('imageFile', editedData.imageFile);
    }

    // Log the formData object just before sending
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    axios
      .put(`https://localhost:7092/api/Team/UpdateTeam?teamId=${teamId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success('Profile updated successfully');
          navigate('/TeamHome');
          setIsEditing(false);
        } else {
          // Handle unexpected response status
          console.error('Unexpected response status:', response.status);
          toast.error('An unexpected error occurred while updating team profiles');
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Server responded with error data:', error.response.data);
          console.error('Server responded with error status:', error.response.status);
          toast.error('An error occurred while updating team profiles: ' + error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received from server:', error.request);
          toast.error('No response received from server. Please try again later.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up the request:', error.message);
          toast.error('An unexpected error occurred. Please try again later.');
        }
      });
  };
  
  const renderTeamData = () => {
    const renderField = (label, value) => {
      return isEditing ? (
        <TextField
          fullWidth
          variant="outlined"
          name={label}
          value={editedData[label] || ''}
          onChange={handleInputChange}
          label={label.charAt(0).toUpperCase() + label.slice(1)}
        />
      ) : (
        <Typography variant="body1">{value}</Typography>
      );
    };
  
    const renderImage = () => {
      if (!isEditing && teamData.imagePath) {
        return (
          <TableRow>
            <TableCell className="attribute">Logo</TableCell>
            <TableCell className="data">
              <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                <img
                  src={`https://localhost:7092/images/${teamData.imagePath}`}
                  alt="Team Logo"
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            </TableCell>
          </TableRow>
        );
      } else if (isEditing) {
        return (
          <TableRow>
            <TableCell className="attribute">Logo</TableCell>
            <TableCell className="data">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </TableCell>
          </TableRow>
        );
      } else {
        return null;
      }
    };
    

    return (
      <div>
        <Typography variant="h4" className="headingTeamProfile">
          Team Profile
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="attribute">Name</TableCell>
                <TableCell className="data">{renderField('name', teamData.name)}</TableCell>
              </TableRow>
  
              <TableRow>
                <TableCell className="attribute">Phone Number</TableCell>
                <TableCell className="data">{renderField('phoneNumber', teamData.phoneNumber)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Address1</TableCell>
                <TableCell className="data">{renderField('address1', teamData.address1)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Address2</TableCell>
                <TableCell className="data">{renderField('address2', teamData.address2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Address3</TableCell>
                <TableCell className="data">{renderField('address3', teamData.address3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Country</TableCell>
                <TableCell className="data">{renderField('country', teamData.country)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Team Principal</TableCell>
                <TableCell className="data">{renderField('teamPrincipal', teamData.teamPrincipal)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Technical Chief</TableCell>
                <TableCell className="data">{renderField('technicalChief', teamData.technicalChief)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Engine Supplier</TableCell>
                <TableCell className="data">{renderField('engineSupplier', teamData.engineSupplier)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Chassis</TableCell>
                <TableCell className="data">{renderField('chassis', teamData.chassis)}</TableCell>
              </TableRow>
  
              {renderImage()}
  
              <TableRow>
                <TableCell colSpan="2" className="edit">
                  {isEditing ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        className="updateButton"
                        onClick={handleUpdateProfile}
                      >
                        Update Profile
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className="cancelButton"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" color="primary" className="editButton" onClick={handleEditProfile}>
                      Edit Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <div>
      <TeamNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="container-fluid">
        <div className="row">
          <TeamSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="team-home-content">
              {renderTeamData()}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeamViewProfile;
