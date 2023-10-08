import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import Footer from './Footer';
import './AuthenticatedUserHome.css';
import jwt_decode from 'jwt-decode';
import { HomeCarousel } from './HomeCarousel';
import { About } from './About';

const AuthenticatedUserHome = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Check if the JWT token is present in local storage
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            // If the token is not present, show a toast and redirect to the login page
            toast.error('Login and then access the Home page');
            navigate('/Signin');
        } else {
            const tokenPayload = jwt_decode(token);

            if (tokenPayload.RoleId === 'Admin') {
                navigate('/AdminHome');
            } else if (tokenPayload.RoleId === 'User') {
                setUserName(tokenPayload.userName);
                // Rest of your code here
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        // Remove the JWT token from local storage
        localStorage.removeItem('jwtToken');
        toast.success('Logged out successfully');
        navigate('/Signin'); // Redirect to the login page
    };

    return (
        <div className="wrapper">
            <UserNavbar />
            <br />
            <div className="Usercontent1">
                {/* Use userName here */}
                <h1>Hello {userName}</h1>
                <h1>Welcome Back to the Fan Hub</h1>
            </div>
            <HomeCarousel />
            <About />
            <Footer />
        </div>
    );
};

export default AuthenticatedUserHome;
