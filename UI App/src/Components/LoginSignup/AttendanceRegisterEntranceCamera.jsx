import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import './AttendanceRegisterEntranceCamera.css';

const AttendanceRegisterEntranceCamera = () => {
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
          if (data.employee_id !== "" || data.employee_id !== "PROCESSING") {
            createEmployee(data.employee_id, data.detected_face_name);
          }
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


  const createEmployee = (employeeId, employeeName) => {

    const employeeData = {
      employeeId: employeeId,
      employeeName: employeeName
    };
    if (employeeId === "" || employeeId === "PROCESSING") {
      console.error('Error creating employee: No employee ID detected');
      return;
    }
    else {
      console.log("Creating Employee with ID: ", employeeId);
      console.log("Creating Employee with Name: ", employeeName);

      fetch('https://localhost:7092/api/Employee/CreateEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Employee created:", data);
          // Update employee IDs after creating the new employee
          fetchEmployeeIds();
        })
        .catch(error => {
          console.error('Error creating employee:', error);
        });
    }
  };

  const EmployeeEntry = (employeeId) => {
    const requestBody = JSON.stringify(employeeId);

    {/*  avoid "PROCESSING" and "" as employeeId */ }
    if (employeeId === "" || employeeId === "PROCESSING") {
      console.error('Error recording employee entry: No employee ID detected');
      toast.error('NO EMPLOYEE ID DETECTED');
      return;
    }
    else {
      fetch('https://localhost:7092/api/AttendanceRegister/EmployeeEntry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      })
        .then(response => {
          if (response.ok) {
            console.log('Employee entry recorded successfully');
            toast.success('EMPLYEE ENTRY RECORDED SUCCESSFULLY');
          } else if (response.status === 400) {
            console.error('Error recording employee entry: Employee is already clocked in');
          } else {
            console.error('Failed to record employee entry');
            toast.error('EMPLYEE ALREADY CLOCKED IN');
          }
        })
        .catch(error => {
          console.error('Error recording employee entry:', error);
          toast.error('FAILED TO RECORD EMPLOYEE ENTRY');
        });
    }
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
          className="entryButton"
          onClick={() => EmployeeEntry(employeeId)}
        >
          Mark Entry
        </button>
      </div>
      <ToastContainer />
    </Container>
  );
};

export default AttendanceRegisterEntranceCamera;
