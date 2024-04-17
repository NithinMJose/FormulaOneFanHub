import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';
import TeamSidebar from '../sidebar/TeamSidebar';
import Footer from '../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure you have jspdf-autotable installed
import './TeamSellingReport.css'; // Make sure the path to the CSS file is correct
import { margin } from '@mui/system';

const TeamSellingReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const teamId = decoded.teamId;
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');


  const handleStartDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      // If selected date is in the future, set error message
      setStartDateError('Selected date cannot be in the future');
      setStartDate(currentDate.toISOString().split('T')[0]); // Set start date to current date
      setTimeout(() => {
        setStartDateError(''); // Clear error message after 1 second
      }, 1000);
    } else {
      // Clear error message
      setStartDateError('');
      setStartDate(event.target.value);
    }
  };

  const handleEndDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      // If selected date is in the future, set error message
      setEndDateError('Selected date cannot be in the future');
      setEndDate(currentDate.toISOString().split('T')[0]); // Set end date to current date
      setTimeout(() => {
        setEndDateError(''); // Clear error message after 1 second
      }, 1000);
    } else {
      // Clear error message
      setEndDateError('');
      setEndDate(event.target.value);
    }
  };





  const generateReport = async () => {
    try {
      const response = await axios.get(`https://localhost:7092/api/SoldItem/GetSoldItemHistoryByTeam/${teamId}`);
      const filteredItems = response.data.filter(item => {
        const soldDate = new Date(item.soldDate);
        return soldDate >= new Date(startDate) && soldDate <= new Date(endDate);
      });
      setFilteredItems(filteredItems);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };


  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    // Add background image
    const backgroundImage = 'img/demoback.jpg'; // Replace 'path/to/your/background/image.jpg' with the actual path to your image
    doc.addImage(backgroundImage, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

    // Header
    doc.setFillColor(128, 128, 128); // Grey background
    doc.rect(0, 0, 210, 30, 'F'); // Header rectangle
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // White text
    doc.text('Formula 1 Connection Hub: Explore, Engage, Elevate', 10, 15, { align: 'left' });
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255); // White text
    doc.text('Formula One Fan Hub', 10, 25, { align: 'left' });

    // Start and end date
    const startDateText = `Start Date: ${startDate}`;
    const endDateText = `End Date: ${endDate}`;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black text
    doc.text(startDateText, 10, 40);
    doc.text(endDateText, 10, 45);

    // Calculate the total amount
    const totalAmount = filteredItems.reduce((acc, item) => acc + item.totalPrice, 0);

    // Main content with "Serial No." column
    doc.autoTable({
      head: [['Serial No.', 'Product Name', 'Quantity', 'Price Per Item', 'Total Price', 'Sold Date']],
      body: filteredItems.map((item, index) => [
        index + 1, // Serial No. starts from 1
        item.productName,
        item.quantity,
        item.pricePerItem,
        item.totalPrice,
        new Date(item.soldDate).toLocaleString()
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 2,
        lineWidth: 0.1,
        fillColor: [255, 255, 255], // White background for cells
        textColor: [0, 0, 0], // Black text
        halign: 'center',
        valign: 'middle',
        lineColor: [0, 0, 0], // Black lines
        headerStyles: {
          fillColor: [128, 128, 128], // Grey background for header
          textColor: [255, 255, 255], // White text for header
          lineColor: [0, 0, 0], // Black lines for header
        },
        alternateRowStyles: {
          fillColor: [235, 235, 235], // Light grey background for alternate rows
        },
      },
      margin: { top: 55 } // Adjust the top margin to accommodate the header and dates
    });

    // Calculate the position for the total amount table
    const pageWidth = 210; // A4 page width in mm
    const maxTableWidth = 80; // Desired maximum width of the total amount table in mm
    const xPosition = pageWidth - maxTableWidth; // Calculate the x-coordinate for right alignment

    // Add the total amount to the PDF with "Serial No." column
    doc.autoTable({
      head: [['Total Amount']],
      body: [[totalAmount]], // Leave "Serial No." empty for the total amount row
      styles: {
        fontSize: 10,
        cellPadding: 2,
        lineWidth: 0.1,
        fillColor: [128, 128, 128], // Grey background for total row
        textColor: [0, 0, 0], // Black text for total row
        halign: 'middle',
        valign: 'middle',
        lineColor: [0, 0, 0], // Black lines
        fillColor: [128, 128, 128], // Grey background for total row
      },
      margin: { top: 10, left: xPosition } // Adjust the top margin and left margin to place the total row correctly and right-align it
    });

    // Footer
    doc.setFillColor(128, 128, 128); // Grey background
    doc.rect(0, doc.internal.pageSize.height - 30, 210, 30, 'F'); // Footer rectangle
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // White text
    doc.text('Formula One fan Hub : Elevating Ideas...', 10, doc.internal.pageSize.height - 20, { align: 'left' });

    doc.save('SellingReport.pdf');
  };



  return (
    <div>
      <TeamNavbar />
      <div className="container-fluid" style={{ paddingTop: '91px' }}>
        <div className="row">
          <TeamSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Container>
              <Typography variant="h4" gutterBottom>Generate Selling Report</Typography>
              <Grid container spacing={2}>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="start-date"
                    label="Start Date"
                    type="date"
                    className='StartDateField'
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: '', // Initially set minimum date to empty string
                    }}
                    fullWidth
                    error={startDateError !== ''}
                    helperText={startDateError}
                  />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="end-date"
                    label="End Date"
                    type="date"
                    className='EndDateField'
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: '', // Initially set minimum date to empty string
                    }}
                    fullWidth
                    error={endDateError !== ''}
                    helperText={endDateError}
                  />

                </Grid>

                <Grid item xs={12}>
                  <Button className='ReportButtons' variant="contained" color="primary" style={{ marginRight: "20px" }} onClick={generateReport}>
                    Generate Report
                  </Button>
                  <Button className='PdfButtons' variant="contained" color="secondary" onClick={generatePDF}>
                    Download PDF
                  </Button>
                </Grid>
              </Grid>
              <Typography className='HeadingOne' variant="h5" gutterBottom>Selling Report</Typography>
              <TableContainer component={Paper} id="pdf-content">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price Per Item</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Sold Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredItems.map(item => (
                      <TableRow key={item.soldItemId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.pricePerItem}</TableCell>
                        <TableCell>{item.totalPrice}</TableCell>
                        <TableCell>{new Date(item.soldDate).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {/* Display the total amount */}
                  <TableBody>
                    <TableRow>
                      <br />
                      <br />
                      <TableCell className='totalAmountHeading' style={{ fontSize: '25px' }} colSpan={3} align="right">Total Amount</TableCell>
                      <TableCell className='totalAmountMoney' style={{ fontSize: '25px', fontWeight: 'bold' }}>{filteredItems.reduce((acc, item) => acc + item.totalPrice, 0)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>

                </Table>
              </TableContainer>
              <br />
            </Container>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeamSellingReport;