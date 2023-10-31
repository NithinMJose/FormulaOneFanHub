import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './F1HistoryUpdate.css';
import AdminNavbar from './AdminNavbar';

const F1HistoryUpdate = () => {
  const { historyId } = useParams();
  const [historyData, setHistoryData] = useState({
    heading: '',
    paragraph: '',
  });

  const [editableField, setEditableField] = useState('');

  useEffect(() => {
    axios
      .get(`https://localhost:7092/api/F1History/GetF1HistoryById?id=${historyId}`)
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
  };

  const handleUpdateClick = () => {
    if (editableField !== '') {
      // Changes have been made, perform the update
      const updateData = {
        id: historyId,
        heading: editableField === 'heading' ? historyData.heading : historyData.paragraph,
        paragraph: historyData.paragraph,
      };

      axios
        .put(`https://localhost:7092/api/F1History/UpdateF1History?id=${historyId}`, updateData)
        .then((response) => {
          console.log('Update successful:', response);
        })
        .catch((error) => {
          console.error('Error updating F1 history data:', error);
        });
    }

    // Reset editableField after performing the update
    setEditableField('');
  };

  return (
    <div>
    <AdminNavbar/>
    <div className="container">
      
      <h1 className="headingUpdateDriver">F1 History Details</h1>
      <table>
        <tbody>
          <tr>
            <td className="attribute">Heading</td>
            <td>
              {editableField === 'heading' ? (
                <input
                  type="text"
                  value={historyData.heading}
                  onChange={(e) => handleFieldChange(e.target.value)}
                />
              ) : (
                historyData.heading
              )}
            </td>
            <td className="edit">
              {editableField === 'heading' && (
                <button className="btn btn-primary btn-update" onClick={handleUpdateClick}>
                  Update
                </button>
              )}
              {editableField !== 'heading' && (
                <button className="btn btn-primary btn-edit" onClick={() => handleEditClick('heading')}>
                  Edit
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className="attribute">Paragraph</td>
            <td>
              {editableField === 'paragraph' ? (
                <input
                  type="text"
                  value={historyData.paragraph}
                  onChange={(e) => handleFieldChange(e.target.value)}
                />
              ) : (
                historyData.paragraph
              )}
            </td>
            <td className="edit">
              {editableField === 'paragraph' && (
                <button className="btn btn-primary btn-update" onClick={handleUpdateClick}>
                  Update
                </button>
              )}
              {editableField !== 'paragraph' && (
                <button className="btn btn-primary btn-edit" onClick={() => handleEditClick('paragraph')}>
                  Edit
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <button className="btn btn-primary btn-update" onClick={() => setEditableField('')}>
        Delete Data
      </button>
    </div>
    </div>
  );
};

export default F1HistoryUpdate;
