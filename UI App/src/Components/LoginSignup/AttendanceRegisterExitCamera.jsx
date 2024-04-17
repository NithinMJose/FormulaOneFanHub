import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import './AttendanceRegisterExitCamera.css';

const AttendanceRegisterExitCamera = () => {
  const [detectedFaceName, setDetectedFaceName] = useState('PROCESSING');
  const [employeeId, setEmployeeId] = useState('PROCESSING');
  const [employeeIds, setEmployeeIds] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDetectedFace();
      fetchEmployeeIds();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmployeeIds = () => {
    fetch('https://localhost:7092/api/Employee/GetAllEmployeeIds')
      .then(response => response.json())
      .then(data => {
        setEmployeeIds(data);
        console.log("Employee IDS: ", data);
      })
      .catch(error => {
        console.error('Error fetching employee ids:', error);
      });
  };


  const fetchDetectedFace = () => {
    fetch('http://127.0.0.1:8100/get_detected_face_name/')
      .then(response => response.json())
      .then(data => {
        console.log("DATA IS: ", data);
        setDetectedFaceName(data.detected_face_name);
        setEmployeeId(data.employee_id);

        const lowercaseEmployeeIds = employeeIds.map(id => id.toLowerCase());
        const lowercaseDetectedEmployeeId = data.employee_id.toLowerCase();
        {/*  avoid "PROCESSING" and "" as employeeId */ }
        if (!lowercaseEmployeeIds.includes(lowercaseDetectedEmployeeId || lowercaseDetectedEmployeeId === "" || lowercaseDetectedEmployeeId === "processing")) {
          console.log("NEW EMPLOYEEID DETECTED: ", data.employee_id);
        }
        else {
          console.log("EXISTING EMPLOYEEID DETECTED: ", data.employee_id);
        }
      })
      .catch(error => {
        console.error('Error fetching detected face name:', error);
        setDetectedFaceName('PROCESSING');
        setEmployeeId('PROCESSING');
      });
  };


  const EmployeeExit = (employeeId) => {
    const requestBody = JSON.stringify(employeeId);

    fetch('https://localhost:7092/api/AttendanceRegister/EmployeeLeave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    })
      .then(response => {
        if (response.ok) {
          console.log('Employee clocked out successfully');
          toast.success('Employee clocked out successfully');
        } else if (response.status === 400) {
          console.error('Error recording employee exit: Employee is not currently clocked in');
          toast.error('Employee is not currently clocked in');
        } else {
          console.error('Failed to record employee exit');
          toast.error('Failed to record employee exit');
        }
      })
      .catch(error => {
        console.error('Error recording employee exit:', error);
        toast.error('Failed to record employee exit');
      });
  };



  return (
    <Container className="containerss">
      <div className="leftContainerss">
        <Typography variant="h4" className="title">
          Attendance Register
        </Typography>
        <Typography variant="h5" className="info">
          Detected Face Name: {detectedFaceName}
        </Typography>
        <Typography variant="h5" className="info">
          Employee ID: {employeeId}
        </Typography>
      </div>
      <div className="rightContainerss">
        <button
          className="exitButton"
          onClick={() => EmployeeExit(employeeId)}
        >
          Mark Exit
        </button>
      </div>
      <ToastContainer />
    </Container>
  );
};

export default AttendanceRegisterExitCamera;
