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
} from '@mui/material';
import axios from 'axios';
import Footer from './Footer';
import AdminNavbar from './AdminNavbar';
import jwt_decode from 'jwt-decode';
import { BASE_URL } from '../../config';

const UserList = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [managedUser, setManagedUser] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as an Admin to access the page');
      navigate('/');
      return;
    }

    try {
      const tokenPayload = jwt_decode(token);
      const roleId = tokenPayload['RoleId'];

      if (roleId !== 'Admin') {
        toast.error('You have to be logged in as an Admin to access the page');
        navigate('/');
        return;
      }

      axios
        .get(`${BASE_URL}/api/Admin/ListUsers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            // You might want to redirect to the login page here
            navigate('/');
          } else {
            toast.error('An error occurred while fetching user data');
          }
        });
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const handleDeleteAccount = (userName) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');

    if (confirmDelete) {
      axios
        .delete(`${BASE_URL}/api/User/DeleteUser?userName=${userName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          axios
            .get(`${BASE_URL}/api/Admin/ListUsers`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setUserData(response.data);
              toast.success('User deleted successfully');
            })
            .catch((error) => {
              console.error('Error fetching user data:', error);
              toast.error('An error occurred while fetching user data');
            });
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          toast.error('An error occurred while deleting the user');
        });
    }
  };

  const handleAccountToInactive = (userName) => {
    const confirmDeactivate = window.confirm('Are you sure you want to deactivate this user?');
  
    if (confirmDeactivate) {
      axios
        .put(
          `${BASE_URL}/api/User/DeactivateUser?userName=${userName}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          // Call the SendBanEmail endpoint after deactivating the user
          axios.post(`${BASE_URL}/api/User/SendBanEmail`, {
            userName: userName,
          })
          .then(() => {
            // Fetch updated user data after sending ban email
            axios
              .get(`${BASE_URL}/api/Admin/ListUsers`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                setUserData(response.data);
                toast.success('User deactivated successfully');
              })
              .catch((error) => {
                console.error('Error fetching user data:', error);
                toast.error('An error occurred while fetching user data');
              });
          })
          .catch((error) => {
            console.error('Error sending ban email:', error);
            toast.error('An error occurred while sending the ban email');
          });
        })
        .catch((error) => {
          console.error('Error deactivating user:', error);
          toast.error('An error occurred while deactivating the user');
        });
    }
  };
  

  const handleAccountToActive = (userName) => {
    const confirmActivate = window.confirm('Are you sure you want to Activate this user?');
  
    if (confirmActivate) {
      axios
        .put(
          `${BASE_URL}/api/User/ActivateUser?userName=${userName}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          // Call the SendAcivateEmail endpoint after Activating the user
          axios.post(`${BASE_URL}/api/User/SendActivateEmail`, {
            userName: userName,
          })
          .then(() => {
            // Fetch updated user data after sending Activation email
            axios
              .get(`${BASE_URL}/api/Admin/ListUsers`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                setUserData(response.data);
                toast.success('User Activated successfully');
              })
              .catch((error) => {
                console.error('Error fetching user data:', error);
                toast.error('An error occurred while fetching user data');
              });
          })
          .catch((error) => {
            console.error('Error sending Activation email:', error);
            toast.error('An error occurred while sending the Activation email');
          });
        })
        .catch((error) => {
          console.error('Error Activating user:', error);
          toast.error('An error occurred while Activating the user');
        });
    }
  };

  const handleUpgradeToAdmin = (userName) => {
    axios
      .post(`${BASE_URL}/api/User/UpgradeUser?userName=${userName}`)
      .then(() => {
        axios
          .get(`${BASE_URL}/api/Admin/ListUsers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setUserData(response.data); // Set updated user data in state
            toast.success(`${userName} upgraded to Admin successfully`);
            setManagedUser(null); // Reset the managed user state
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            toast.error('An error occurred while fetching user data');
            setManagedUser(null); // Reset the managed user state on error
          });
      })
      .catch((error) => {
        console.error('Error upgrading user to Admin:', error);
        toast.error(`An error occurred while upgrading ${userName} to Admin`);
        setManagedUser(null); // Reset the managed user state on error
      });
  };

  const renderUserData = () => {
    if (!userData) {
      return <p>Loading user data...</p>;
    }

    return (
      <div className="user-container">
        <div className="user-content">
          <h1 className="user-heading">Users List</h1>
          <TableContainer component={Paper}>
            <Table className="user-table" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>SlNo.</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.map((user, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color={user.status === 'active' ? 'success' : 'error'}
                        >
                          {user.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {user.status === 'active' ? (
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleAccountToInactive(user.userName)}
                          >
                            DEACTIVATE
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleAccountToActive(user.userName)}
                          >
                            ACTIVATE
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                    {managedUser === user.userName && (
                      <TableRow>
                        <TableCell colSpan="7">
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleUpgradeToAdmin(user.userName)}
                          >
                            Upgrade {user.userName} to Admin
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  };

  return (
    <div>
      <AdminNavbar />
      <br />
      <br />
      {renderUserData()}
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default UserList;
