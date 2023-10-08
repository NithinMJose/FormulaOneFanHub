import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthenticatedUserHome = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the JWT token is present in local storage
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            // If token is not present, show a toast and redirect to the login page
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

    return (
        <div className="container">
            <h1>Hello User</h1>
            <h1>Welcome to the Home Page</h1>
            {/* Add your home page content here */}
            <button className="submit" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default AuthenticatedUserHome;
