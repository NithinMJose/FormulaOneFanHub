// F1HistoryUserView.jsx

import React, { useState, useEffect } from 'react';
import './F1HistoryUserView.css';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import UserNavbar from '../LoginSignup/UserNavbar';
import { BASE_URL } from '../../config';

const F1HistoryUserView = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/F1History/GetAllF1Histories`);
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <UserNavbar />
      <div className="history-container">
        {historyData.map((item) => (
          <div key={item.historyId} className="history-item">
            <h2 className="subheading">{item.heading}</h2>
            {item.paragraph && <p className="content">{item.paragraph}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default F1HistoryUserView;
