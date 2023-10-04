import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import axios from 'axios';
import './UserList.css';
import Footer from './Footer';
import AdminNavbar from './AdminNavbar';

const UserList = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [managedUser, setManagedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You are not authorized to access this page');
      navigate('/Signin');
    } else {
      try {
        axios
          .get(`https://localhost:7092/api/Admin/ListUsers`)
          .then((response) => {
            setUserData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            toast.error('An error occurred while fetching user data');
          });
      } catch (error) {
        console.error('Error decoding token:', error);
        toast.error('An error occurred while decoding the token');
        navigate('/Signin');
      }
    }
  }, [navigate]);

  const handleDeleteAccount = (userName) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');

    if (confirmDelete) {
      axios
        .delete(`https://localhost:7092/api/User/DeleteUser?userName=${userName}`)
        .then(() => {
          axios
            .get(`https://localhost:7092/api/Admin/ListUsers`)
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

  const handleManage = (userName) => {
    setManagedUser(userName); // Set the user to be managed
  };

  const handleUpgradeToAdmin = (userName) => {
    axios
      .post(`https://localhost:7092/api/User/UpgradeUser?userName=${userName}`)
      .then(() => {
        axios
          .get(`https://localhost:7092/api/Admin/ListUsers`)
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
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th className="user-heading-bg">Username</th>
                  <th className="user-heading-bg">Email</th>
                  <th className="user-heading-bg">First Name</th>
                  <th className="user-heading-bg">Last Name</th>
                  <th className="user-heading-bg">Created On</th>
                  <th className="user-heading-bg">Created By</th>
                  <th className="user-heading-bg">Action</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.createdOn}</td>
                      <td>{user.createdBy}</td>
                      <td className="user-buttons">
                        <button
                          className="btn btn-primary btn-manage"
                          onClick={() => handleManage(user.userName)}
                        >
                          Manage
                        </button>
                        <button
                          className="btn btn-danger btn-delete"
                          onClick={() => handleDeleteAccount(user.userName)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {managedUser === user.userName && (
                      <tr>
                        <td colSpan="7" className="user-buttons">
                          <button
                            className="btn btn-danger btn-upgrade"
                            onClick={() => handleUpgradeToAdmin(user.userName)}
                          >
                            Upgrade {user.userName} to Admin
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
      {renderUserData()}
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default UserList;
