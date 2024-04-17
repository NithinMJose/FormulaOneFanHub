import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import axios from 'axios';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';


const TopicListAdmin = () => {
  const navigate = useNavigate();
  const [topicData, setTopicData] = useState(null);
  const token = localStorage.getItem('jwtToken');


  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      axios
        .get(`${BASE_URL}/api/Topic/GetAllTopics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTopicData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching topic data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            // You might want to redirect to the login page here
            navigate('/');
          } else {
            toast.error('An error occurred while fetching topic data');
          }
        });
    } catch (error) {
      console.error('An error occurred while decoding the token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const renderTopicData = () => {
    if (!topicData) {
      return <p>Loading topic data...</p>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>Topic ID</TableCell>
              <TableCell style={{ width: '15%' }}>Title</TableCell>
              <TableCell style={{ width: '50%' }}>Content</TableCell>
              <TableCell style={{ width: '20%' }}>Created On</TableCell>
              <TableCell style={{ width: '10%' }}>User ID</TableCell>
              <TableCell style={{ width: '10%' }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topicData.map((topic) => (
              <TableRow key={topic.topicId}>
                <TableCell>{topic.topicId}</TableCell>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{topic.content}</TableCell>
                <TableCell>{new Date(topic.createdOn).toLocaleString()}</TableCell>
                <TableCell>{topic.userId}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManageTopic(topic.topicId)}
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

  const handleManageTopic = (topicId) => {
    // Redirect to the UpdateTopic page with the specific topicId
    navigate('/EditTopic', { replace: true, state: {topicId } });

  };

  return (
    <div className="topiclistpage">
      <AdminNavbar />
      <br />
      <br />
      <br />
      <br />
      {renderTopicData()}
      <br />
      <Footer />
    </div>
  );
};

export default TopicListAdmin;
