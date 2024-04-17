import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, CssBaseline, Avatar, Grid, Paper, Box } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import { BASE_URL } from '../../config';

const Signin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if there is a valid token in localStorage
    const token = localStorage.getItem('jwtToken');

    if (token) {
      // Parse the token to get the RoleId
      const tokenPayload = jwt_decode(token);
      const roleId = tokenPayload['RoleId'];

      // Redirect based on the RoleId
      if (roleId === '4') {
        navigate('/AdminHome');
      } else if (roleId === '3') {
        navigate('/UserHome');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/User/Login`, {
        userName: username,
        password: password,
      });

      if (response.data.token) {
        // Store the token in local storage
        localStorage.setItem('jwtToken', response.data.token);
        console.log(response.data.token);

        // Parse the token to get the RoleId and Status
        const tokenPayload = jwt_decode(response.data.token);
        const roleId = tokenPayload['RoleId'];
        const status = tokenPayload['Status'];

        if (status === "active") {
          toast.success('Login successful');

          // Navigate based on the RoleId
          if (roleId === "Admin") {
            navigate('/AdminHome');
          } else if (roleId === "User") {
            navigate('/UserHome');
          } else {
            navigate('/HomePage');
          }
        } else if (status === "inactive") {
          toast.error('Account has been banned. Contact Admin for details');
        }
      } else if (response.data.status === "inactive") {
        toast.error('Account has been banned. Contact Admin for details');
      } else {
        toast.error('Password is incorrect');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        handleTeamLogin();
      } else {
        toast.error('An error occurred during login');
      }
    }
  };


  const handleTeamLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/Team/Login`, {
        userName: username,
        password: password,
      });

      if (response.data.token) {
        // Store the token in local storage
        localStorage.setItem('jwtToken', response.data.token);
        console.log(response.data.token);

        // Parse the token to get the RoleId and Status
        const tokenPayload = jwt_decode(response.data.token);
        const roleId = tokenPayload['RoleId'];
        const status = tokenPayload['Status'];
        const teamId = tokenPayload['teamId'];
        console.log(roleId);
        console.log(status);
        console.log(teamId);

        if (roleId === "Team") {
          if (status === "active") {
            toast.success('Login successful');
            console.log('SUCCESSFUL LOGIN');
            navigate('/');
          } else if (status === "inactive") {
            toast.error('Account has not been activated yet. Complete the profile to activate the account');
            navigate('/');
          }
        }
      } else if (response.data.status === "inactive") {
        toast.error('Account has been banned. Contact Admin for details');
      } else {
        toast.error('Password is incorrect');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        handleDeliveryCompanyLogin();
      } else {
        toast.error('An error occurred during login');
      }
    }
  };

  const handleDeliveryCompanyLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/DeliveryCompany/Login`, {
        CompanyName: username, // Change 'userName' to 'CompanyName'
        Password: password, // Change 'password' to 'Password'
      });

      if (response.data.token) {
        // Store the token in local storage
        localStorage.setItem('jwtToken', response.data.token);
        console.log(response.data.token);

        // Parse the token to get the RoleId and Status
        const tokenPayload = jwt_decode(response.data.token);
        const role = tokenPayload['Role'];
        const status = tokenPayload['CompanyStatus'];
        const deliveryCompanyId = tokenPayload['DeliveryCompanyId']; // Correct the case

        console.log(role);
        console.log(status);
        console.log(deliveryCompanyId);

        if (role === "DeliveryCompany") {
          if (status === "active") {
            toast.success('Login successful');
            console.log('SUCCESSFUL LOGIN');
            navigate('/');
          } else if (status === "inactive") {
            toast.error('Account has been banned. Contact Admin for details');
          }
        }
      } else if (response.data.message === "Wrong password") { // Change 'status' to 'message'
        toast.error('Password is incorrect');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        toast.error('Invalid username or password');
      } else {
        toast.error('An error occurred during login');
      }
    }
  }


  return (
    <div>
      <HomeNavbar />
      <br />
      <br />
      <br />
      <br />
      <br />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={3}>
          <Box sx={{ padding: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <TextField
                name="username"
                id="username"
                margin="normal"
                required
                fullWidth

                label="Username"
                autoComplete="username"
                autoFocus
                value={username}


                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                name="password"
                id="password"
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"

                autoComplete="current-password"
                value={password}


                onChange={(e) => setPassword(e.target.value)}
              />
              <Grid container>
                <Grid item xs>
                  <Link to="/ForgotPassword" variant="body2">
                    Lost Password? Click Here!
                  </Link>
                </Grid>
              </Grid>
              <Button
                id="testid"
                fullWidth

                name="testid"
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <br />
      <br />
      <Footer />
    </div>
  );
};

export default Signin;
