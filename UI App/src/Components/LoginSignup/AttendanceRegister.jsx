import React, { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';

const AttendanceRegister = () => {
  const [detectedFaceName, setDetectedFaceName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [allEmployeeIds, setAllEmployeeIds] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8100/get_detected_face_name/')
      .then(response => response.json())
      .then(data => {
        setDetectedFaceName(data.detected_face_name);
        setEmployeeId(data.employee_id);
      })
      .catch(error => {
        console.error('Error fetching detected face name:', error);
      });

    fetch('https://localhost:7092/api/Employee/GetAllEmployeeIds')
      .then(response => response.json())
      .then(data => {
        setAllEmployeeIds(data);
      })
      .catch(error => {
        console.error('Error fetching employee IDs:', error);
      });
  }, []); // Run only once when the component mounts

  const handleWrongFaceClick = () => {
    window.location.reload(); // Reload the page
  };

  const handleMarkAttendanceClick = () => {
    if (!employeeId) {
      console.log('Employee ID is empty');
      return;
    }

    if (allEmployeeIds.includes(employeeId)) {
      markAttendance();
    } else {
      createEmployeeAndMarkAttendance();
    }
  };

  const handleMarkLeaveClick = () => {
    markLeave();
  };

  const markAttendance = () => {
    const requestBody = employeeId;
    fetch('https://localhost:7092/api/AttendanceRegister/EmployeeEntry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (response.ok) {
          console.log('Attendance marked successfully');
        } else {
          console.error('Failed to mark attendance:', response.status);
        }
      })
      .catch(error => {
        console.error('Error marking attendance:', error);
      });
  };

  const createEmployeeAndMarkAttendance = () => {
    const requestBody = {
      employeeId: employeeId,
      employeeName: detectedFaceName,
    };
    fetch('https://localhost:7092/api/Employee/CreateEmployee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (response.ok) {
          setAllEmployeeIds([...allEmployeeIds, employeeId]);
          markAttendance();
        } else {
          console.error('Failed to create employee:', response.status);
        }
      })
      .catch(error => {
        console.error('Error creating employee:', error);
      });
  };

  const markLeave = () => {
    const requestBody = employeeId;
    fetch('https://localhost:7092/api/AttendanceRegister/EmployeeLeave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (response.ok) {
          console.log('Leave marked successfully');
        } else {
          console.error('Failed to mark leave:', response.status);
        }
      })
      .catch(error => {
        console.error('Error marking leave:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Attendance Register
      </Typography>
      <br />
      <br />
      <h1>Detected Face Name : {detectedFaceName}</h1>
      <h1>Employee ID : {employeeId}</h1>
      <br />
      <br />
      <Button variant="contained" onClick={handleWrongFaceClick}>Wrong Face</Button>
      <Button variant="contained" onClick={handleMarkAttendanceClick}>Mark Attendance</Button>
      <Button variant="contained" onClick={handleMarkLeaveClick}>Mark Leave</Button>
    </Container>
  );
};

export default AttendanceRegister;
