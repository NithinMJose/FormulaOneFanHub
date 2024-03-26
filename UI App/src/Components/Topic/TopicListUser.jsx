import React, { useState, useEffect } from 'react';
import './TopicListUser.css'; // Include your CSS file for styling
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import { useNavigate } from 'react-router-dom';

const TopicListUser = () => {
  const [topicList, setTopicList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('https://localhost:7092/api/Topic/GetAllTopics');
        const data = await response.json();
        setTopicList(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topicId, title) => {
    console.log('Topic Title:', title);
    navigate('/TopicComment', { replace: true, state: { topicId, title } });
  };

  return (
    <div>
      <UserNavbar />
      <br />
      <div className="topic-list-container" style={{ marginTop: "100px" }}>
        {topicList.map((topic) => (
          <div key={topic.topicId} className="topic-container" onClick={() => handleTopicClick(topic.topicId, topic.title)}>
            <h2 className="topic-title">{topic.title}</h2>
            <p className="topic-content">{topic.content}</p>
            <p className="topic-details">
              Created on: {new Date(topic.createdOn).toLocaleString()} by {topic.teamName}
            </p>
            {/* Add additional details here */}
            <p className="topic-details">Team: {topic.teamName}</p>
            <p className="topic-details">Country: {topic.country}</p>
            <p className="topic-details">Status: {topic.status}</p>
            <img src={topic.imagePath} alt={topic.teamName} className="topic-image" />
          </div>
        ))}
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default TopicListUser;
