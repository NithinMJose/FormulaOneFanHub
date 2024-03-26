import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './PollListUser.css'; // Make sure to include your PollListUser.css file
import UserNavbar from '../LoginSignup/UserNavbar';

const PollListUser = () => {
  const [pollList, setPollList] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7092/api/Poll/GetAllPolls');
        const data = await response.json();
        setPollList(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleVoteClick = (pollId) => {
    // Navigate to "/UserVote" without adding PollId to the URL
    navigate('/UserVote', { replace: true, state: { pollId } });
  };

  return (
    <div>
      <UserNavbar />
      <div className="poll-list-container" style={{ marginTop: "100px" }}>
        {pollList.map((poll) => (
          <div key={poll.pollId} className="poll-item" onClick={() => handleVoteClick(poll.pollId)}>
            {/* Use a div instead of Link, and add an onClick handler */}
            <h2 className="poll-question">{poll.question}</h2>
            {/* Add more details if needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollListUser;

