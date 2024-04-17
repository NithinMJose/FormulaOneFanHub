import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Typography, TextField, Box } from '@mui/material';
import { Edit, Check, Delete } from '@mui/icons-material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const F1HistoryUpdate = () => {
  const { historyId } = useParams();
  const [historyData, setHistoryData] = useState({
    heading: '',
    paragraph: '',
  });

  const [editableField, setEditableField] = useState('');
  const [headingError, setHeadingError] = useState('');
  const [paragraphError, setParagraphError] = useState('');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/F1History/GetF1HistoryById?id=${historyId}`)
      .then((response) => {
        setHistoryData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching F1 history data:', error);
      });
  }, [historyId]);

  const handleEditClick = (field) => {
    setEditableField(field);
  };

  const handleFieldChange = (value) => {
    setHistoryData((prevData) => ({ ...prevData, [editableField]: value }));
    validateField(editableField, value);
  };

  const handleUpdateClick = () => {
    if (!validateForm()) {
      // Display an error message or handle validation failure
      return;
    }

    const updateData = {
      id: historyId,
      heading: historyData.heading,
      paragraph: historyData.paragraph,
    };

    axios
      .put(`${BASE_URL}/api/F1History/UpdateF1History?id=${historyId}`, updateData)
      .then((response) => {
        console.log(`${editableField} Update successful:`, response);
      })
      .catch((error) => {
        console.error(`Error updating ${editableField}:`, error);
      });

    setEditableField('');
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'heading':
        validateHeading(value);
        break;
      case 'paragraph':
        validateParagraph(value);
        break;
      default:
        break;
    }
  };

  const validateHeading = (value) => {
    if (value.trim().length < 3) {
      setHeadingError('Heading should be at least 3 characters long');
    } else {
      setHeadingError('');
    }
  };

  const validateParagraph = (value) => {
    if (value.trim().length < 10) {
      setParagraphError('Paragraph should be at least 10 characters long');
    } else {
      setParagraphError('');
    }
  };

  const validateForm = () => {
    let isValid = true;

    validateHeading(historyData.heading);
    validateParagraph(historyData.paragraph);

    // Check if there are any validation errors
    isValid = isValid && !Boolean(headingError);
    isValid = isValid && !Boolean(paragraphError);

    return isValid;
  };

  return (
    <div>
      <AdminNavbar />
      <div className='HistoryUpdatewrapper'>
        <Container maxWidth="md" className="mt-4">
          <br />
          <br />
          <Typography variant="h4" align="center" gutterBottom>
            F1 History Details
          </Typography>
          <br />
          <Box p={4} bgcolor="#f9f9f9" boxShadow={1} style={{ borderRadius: '10px' }}>
            <form>
              <Box mb={2}>
                <Typography variant="h4" align="left" className="attribute" gutterBottom style={{ marginBottom: '30px', fontSize: '1.5rem', color: '#333' }}>
                  Heading
                </Typography>
                {editableField === 'heading' ? (
                  <>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={historyData.heading}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}
                    />
                    {headingError && <Typography variant="caption" color="error">{headingError}</Typography>}
                  </>
                ) : (
                  <Typography variant="body1" component="div" fontWeight="">
                    {historyData.heading}
                  </Typography>
                )}
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => handleEditClick('heading')}
                  style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white' }}
                >
                  Edit
                </Button>
                {editableField === 'heading' && (
                  <Button variant="contained" color="success" onClick={handleUpdateClick}>
                    <Check /> Update
                  </Button>
                )}
              </Box>

              <Box mb={2}>
                <Typography variant="h4" align="left" className="attribute" gutterBottom style={{ marginBottom: '30px', fontSize: '1.5rem', color: '#333' }}>
                  Paragraph
                </Typography>
                {editableField === 'paragraph' ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      value={historyData.paragraph}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}
                    />
                    {paragraphError && <Typography variant="caption" color="error">{paragraphError}</Typography>}
                  </>
                ) : (
                  <Typography variant="body1" component="div" fontWeight="">
                    {historyData.paragraph}
                  </Typography>
                )}
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => handleEditClick('paragraph')}
                  style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white' }}
                >
                  Edit
                </Button>
                {editableField === 'paragraph' && (
                  <Button variant="contained" color="success" onClick={handleUpdateClick}>
                    <Check /> Update
                  </Button>
                )}
              </Box>
            </form>

          </Box>
        </Container>
        <br />
        <br />
        <br />
      </div>
      <Footer />
    </div>
  );
};

export default F1HistoryUpdate;