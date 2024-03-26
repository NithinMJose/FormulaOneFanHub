import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import axios from 'axios';
import './PollList.css'; // Make sure to include your PollList.css file
import Footer from '../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';

const PollList = () => {
  const navigate = useNavigate();
  const [pollData, setPollData] = useState(null);
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
        .get(`https://localhost:7092/api/Poll/GetAllPolls`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPollData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching poll data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            // You might want to redirect to the login page here
            navigate('/');
          } else {
            toast.error('An error occurred while fetching poll data');
          }
        });
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const handleManagePoll = (pollId) => {
    // Redirect to the UpdatePoll page with the specific pollId
    navigate(`/EditPoll`, { replace: true, state: {pollId } });
  };

  const renderPollData = () => {
    if (!pollData) {
      return <p>Loading poll data...</p>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>Sl No.</TableCell>
              <TableCell style={{ width: '40%' }}>Question</TableCell>
              <TableCell style={{ width: '20%' }}>Created On</TableCell>
              <TableCell style={{ width: '20%' }}>Polling Date</TableCell>
              <TableCell style={{ width: '15%' }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pollData.map((poll, index) => (
              <TableRow key={poll.pollId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{poll.question}</TableCell>
                <TableCell>
                  {new Date(poll.createdOn).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  {new Date(poll.pollingDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManagePoll(poll.pollId)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="polllistpage">
      <AdminNavbar />
      <br />
      <div className='container' style={{ marginTop: "100px" }}>
        {renderPollData()}
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default PollList;
