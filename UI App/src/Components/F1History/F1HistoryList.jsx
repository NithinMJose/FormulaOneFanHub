import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import './F1HistoryList.css';
import { BASE_URL } from '../../config';

const F1HistoryList = () => {
  const [f1Histories, setF1Histories] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/F1History/GetAllF1Histories`)
      .then((response) => {
        setF1Histories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching F1 histories:', error);
      });
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="f1-history-container">
        <div className="f1-history-content">
          <Typography variant="h4" color="primary" className="f1-history-heading">
            F1 History List
          </Typography>
          <TableContainer component={Paper} className="table-responsive">
            <Table className="f1-history-table">
              <TableHead>
                <TableRow>
                  <TableCell className="f1-history-heading-bg">Serial No</TableCell>
                  <TableCell className="f1-history-heading-bg">Heading</TableCell>
                  <TableCell className="f1-history-heading-bg">Paragraph</TableCell>
                  <TableCell className="f1-history-heading-bg">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {f1Histories.map((history, index) => (
                  <TableRow key={history.historyId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{history.heading}</TableCell>
                    <TableCell>{history.paragraph}</TableCell>
                    <TableCell className="f1-history-buttons">
                      <Link to={`/F1HistoryUpdate/${history.historyId}`}>
                        <Button variant="contained" color="primary" className="btn-edit">
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default F1HistoryList;
