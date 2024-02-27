// F1HistoryUserView.jsx

import React, { useState, useEffect } from 'react';
import './F1HistoryUserView.css';
import HomeNavbar from '../LoginSignup/HomeNavbar';
import Footer from '../LoginSignup/Footer';

const F1HistoryGuestView = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7092/api/F1History/GetAllF1Histories');
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
      <HomeNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="history-container">
        {historyData.map((item) => (
          <div key={item.historyId} className="history-item">
            <h2 className="subheading">{item.heading}</h2>
            {item.paragraph && <p className="content">{item.paragraph}</p>}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default F1HistoryGuestView;
