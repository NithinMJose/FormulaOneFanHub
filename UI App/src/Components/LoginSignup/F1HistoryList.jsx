import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './F1HistoryList.css';
import AdminNavbar from './AdminNavbar';

const F1HistoryList = () => {
  const [f1Histories, setF1Histories] = useState([]);

  useEffect(() => {
    axios
      .get('https://localhost:7092/api/F1History/GetAllF1Histories')
      .then((response) => {
        setF1Histories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching F1 histories:', error);
      });
  }, []);

  return (
    <div >
    <AdminNavbar />
    <div className="f1-history-container">
      <div className="f1-history-content">
        <h1 className="f1-history-heading">F1 History List</h1>
        <div className="table-responsive">
          <table className="f1-history-table">
            <thead>
              <tr>
                <th className="f1-history-heading-bg">History ID</th>
                <th className="f1-history-heading-bg">Heading</th>
                <th className="f1-history-heading-bg">Paragraph</th>
                <th className="f1-history-heading-bg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {f1Histories.map((history) => (
                <tr key={history.historyId}>
                  <td>{history.historyId}</td>
                  <td>{history.heading}</td>
                  <td>{history.paragraph}</td>
                  <td className="f1-history-buttons">
                    <Link to={`/F1HistoryUpdate/${history.historyId}`} className="btn btn-primary btn-edit">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default F1HistoryList;
