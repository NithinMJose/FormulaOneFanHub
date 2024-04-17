import React, { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import './AttendanceRegisterAdmin.css';

const AttendanceRegisterAdmin = () => {
  const [detectedFaceName, setDetectedFaceName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [stableEmployeeId, setStableEmployeeId] = useState('');
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  useEffect(() => {
    const fetchDetectedFaceData = () => {
      fetchDetectedFace();
    };
    return null;
  }, []);


  useEffect(() => {
    fetchEmployees();
    console.log("Fetching employees");
    updateActiveList();
    const intervalId = setInterval(printHelloWorld, 6000); // Define intervalId here
    return null;
  }, []);



  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStableEmployeeId(employeeId);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [detectedFaceName, employeeId]);

  const fetchDetectedFace = () => {
    fetch('http://127.0.0.1:8100/get_detected_face_name/')
      .then(response => response.json())
      .then(data => {
        console.log("DATA IS: ", data);
        setDetectedFaceName(data.detected_face_name);
        setEmployeeId(data.employee_id);
      })
      .catch(error => {
        console.error('Error fetching detected face name:', error);
      });
  };

  const fetchEmployees = () => {
    fetch('https://localhost:7092/api/AttendanceRegister/GetEmployees')
      .then(response => response.json())
      .then(data => {
        setAllEmployees(data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  };

  const updateActiveList = () => {
    fetch('https://localhost:7092/api/AttendanceRegister/GetActiveEmployees')
      .then(response => response.json())
      .then(data => {
        setActiveEmployees(data);
      })
      .catch(error => {
        console.error('Error fetching active employees:', error);
      });
  };

  const handleWrongFaceClick = () => {
    fetchDetectedFace();
  };

  const handleMarkAttendanceClick = () => {
    if (!stableEmployeeId) {
      console.log('Employee ID is empty');
      return;
    }

    markAttendance();
    updateActiveList();
  };

  const handleMarkLeaveClick = () => {
    markLeave();
    updateActiveList();
  };

  const markAttendance = () => {
    const requestBody = stableEmployeeId;
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

  const markLeave = () => {
    const requestBody = stableEmployeeId;
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

  const printHelloWorld = () => {
    console.log("Hello World");
    fetchDetectedFace();
    fetch('https://localhost:7092/api/Employee/GetAllEmployeeIds')
      .then(response => response.json())
      .then(employeeIds => {
        console.log('Employee IDs:', employeeIds);
        const found = employeeIds.includes(employeeId);
        console.log('Found:', found);
        if (!found) {
          console.log("Need to create the employee");
          const newEmployeeId = employeeId; // Set newEmployeeId to employeeId
          const newEmployeeName = detectedFaceName; // Set newEmployeeName to detectedFaceName
          console.log("Adding new employee: ", newEmployeeId, newEmployeeName);
          const requestBody = {
            employeeId: newEmployeeId,
            employeeName: newEmployeeName
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
                console.log('Employee created successfully');
              } else {
                console.error('Failed to create employee:', response.status);
              }
            })
            .catch(error => {
              console.error('Error creating employee:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error fetching employee IDs from endpoint:', error);
      });
  };

  return (
    <Container className="containerss">
      <div className="leftContainerss">
        <Typography variant="h4" className="title">
          Attendance Register
        </Typography>
        {/*
        <Typography variant="h5" className="info">
          Detected Face Name: {detectedFaceName}
        </Typography>
        <Typography variant="h5" className="info">
          Employee ID: {stableEmployeeId}
        </Typography>
        <div className="button-container">
          <Button variant="contained" onClick={handleWrongFaceClick} className="button">
            Wrong Face
          </Button>
          <Button variant="contained" onClick={handleMarkAttendanceClick} className="button">
            Mark Attendance
          </Button>
          <Button variant="contained" onClick={handleMarkLeaveClick} className="button">
            Mark Leave
          </Button>
        </div>
  */}
      </div>
      <div className="rightContainerss">
        <div className="activeEmployeesContainer">
          <Typography variant="h5" className="active-employees-title">
            Active Employees at the Office:
          </Typography>
          <table className="active-employees">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Last Session Time</th>
              </tr>
            </thead>
            <tbody>
              {activeEmployees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.employeeName}</td>
                  <td>{new Date(employee.lastInTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="allEmployeesContainer">
          <Typography variant="h5" className="all-employees-title" style={{ marginTop: "50px" }}>
            All Employees:
          </Typography>
          <table className="all-employees">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Total Work Time</th>
              </tr>
            </thead>
            <tbody>
              {allEmployees.map(employee => (
                <tr key={employee.employee.id}>
                  <td>{employee.employee.employeeId}</td>
                  <td>{employee.employee.employeeName}</td>
                  <td>{employee.totalWorkTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default AttendanceRegisterAdmin;
