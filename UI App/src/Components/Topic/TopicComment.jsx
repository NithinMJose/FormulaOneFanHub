import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TopicComment = () => {
  const location = useLocation();
  const { state } = location;
  const [comments, setComments] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Comment/TopicComments?topicId=${state.topicId}`);
        const data = await response.json();
        setComments(data);
        fetchUserDetails(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchUserDetails = async (comments) => {
      const userIds = comments.map(comment => comment.userId);
      const uniqueUserIds = [...new Set(userIds)]; // Remove duplicate userIds

      for (const userId of uniqueUserIds) {
        try {
          const userResponse = await fetch(`https://localhost:7092/api/User/GetUserDetailsFromUserId?userId=${userId}`);
          const userData = await userResponse.json();
          setUserDetails(prevDetails => ({ ...prevDetails, [userId]: userData }));
        } catch (error) {
          console.error(`Error fetching user details for userId ${userId}:`, error);
        }
      }
    };

    if (state && state.topicId) {
      fetchComments();
    }
  }, [state]);

  const getUserName = (userId) => {
    return userDetails[userId]?.userName || 'Unknown User';
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <h1>Comments for Topic - {state.topicId}</h1>
      <ul>
        {comments.map(comment => (
          <li key={comment.commentId}>
            <div style={{ border: `2px solid ${getRandomColor()}`, padding: '10px', marginBottom: '10px', borderRadius: '20px' }}>
              <p>{`${getUserName(comment.userId)}`}</p>
              <p>{`${comment.content}`}</p>
              <p>{`${new Date(comment.createdOn).toLocaleString()}`}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicComment;
