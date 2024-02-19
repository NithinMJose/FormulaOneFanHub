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
  
    const updatePayload = {
      teamId: teamId,
      name: editedData.name,
      email: editedData.email,
      phoneNumber: editedData.phoneNumber,
      address1: editedData.address1,
      address2: editedData.address2,
      address3: editedData.address3,
      country: editedData.country,
      teamPrincipal: editedData.teamPrincipal,
      technicalChief: editedData.technicalChief,
      engineSupplier: editedData.engineSupplier,
      chassis: editedData.chassis,
    };
  
    axios
      .post(`https://localhost:7092/api/Team/UpdateTeam?teamId=${teamId}`, updatePayload)
      .then((response) => {
        toast.success('Profile updated successfully');
        setIsEditing(false);
  
        axios
          .get(`https://localhost:7092/api/Team/GetTeamByUserName?userName=${updatePayload.userName}`)
          .then((response) => {
            setTeamData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching updated team data:', error);
            toast.error('An error occurred while fetching updated team data');
          });
      })
      .catch((error) => {
        console.error('Error updating team profile:', error);
        toast.error('An error occurred while updating team profile');
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
                <TableCell className="data">{renderField('phoneNumber',teamData.phoneNumber)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Address1</TableCell>
                <TableCell className="data">{renderField('address1',teamData.address1)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Address2</TableCell>
                <TableCell className="data">{renderField('address2',teamData.address2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Address3</TableCell>
                <TableCell className="data">{renderField('address3',teamData.address3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Country</TableCell>
                <TableCell className="data">{renderField('country',teamData.country)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Team Principal</TableCell>
                <TableCell className="data">{renderField('teamPrincipal',teamData.teamPrincipal)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Technical Chief</TableCell>
                <TableCell className="data">{renderField('technicalChief',teamData.technicalChief)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Engine Supplier</TableCell>
                <TableCell className="data">{renderField('engineSupplier',teamData.engineSupplier)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute">Chassis</TableCell>
                <TableCell className="data">{renderField('chassis',teamData.chassis)}</TableCell>
              </TableRow>
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
    <UserNavbar />
    <br />
    <br />
    <div className="container">{renderTeamData()}</div>
    <br />
    <Footer />
  </div>
);
};

export default TeamViewProfile;
