import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import Footer from './Footer';
import './AuthenticatedUserHome.css';
import jwt_decode from 'jwt-decode';

const AuthenticatedUserHome = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the JWT token is present in local storage
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            // If the token is not present, show a toast and redirect to the login page
            toast.error('Login and then access the Home page');
            navigate('/Signin');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Remove the JWT token from local storage
        localStorage.removeItem('jwtToken');
        toast.success('Logged out successfully');
        navigate('/Signin'); // Redirect to the login page
    };

    const token = localStorage.getItem('jwtToken');
    const tokenPayload = jwt_decode(token);
    const userName = tokenPayload.Name;

    return (
        <div className="wrapper">
            <UserNavbar />
            <br />
            <div className="content">
                <h1>Hello {userName}</h1>
                <h1>Welcome to the Fan Hub</h1>
            </div>
            <br />
            <Footer />
        </div>
    );
};

export default AuthenticatedUserHome;
