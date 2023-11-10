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
      if (roleId === '2') {
        navigate('/AdminHome');
      } else if (roleId === '1') {
        navigate('/UserHome');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7092/api/User/Login', {
        userName: username,
        password: password,
      });
  
      if (response.data.token) {
        // Store the token in local storage
        localStorage.setItem('jwtToken', response.data.token);
  
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
        toast.error('Invalid username or password');
      } else {
        toast.error('An error occurred during login');
      }
    }
  };

  return (
    <div>
      <HomeNavbar />
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
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
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
                fullWidth
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
