import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import Footer from './Footer';
import './AuthenticatedAdminHome.css';
import { HomeCarousel } from './HomeCarousel';
import FooterAdmin from './FooterAdmin';
import { BASE_URL } from '../../config';

const AuthenticatedAdminHome = () => {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]); // State to store the list of users

    useEffect(() => {
        // Check if the JWT token is present in local storage
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            // If token is not present, show a toast and redirect to the login page
            toast.error('Login and then access the Home page');
            navigate('/Signin');
        }
    }, [navigate]);


    const handleListUsers = async () => {
        try {
            // Make an API request to fetch the list of users
            const response = await fetch(`${BASE_URL}/api/Admin/ListUsers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`, // Include JWT token in the request headers
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Extract the names from the user data and store them in the state
                const names = data.map((user) => user.UserName);
                setUsers(names); // Update the users state with the list of names
            } else {
                // Handle error scenarios (e.g., unauthorized)
                toast.error('Failed to fetch user list. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching user list:', error);
            toast.error('An error occurred while fetching the user list.');
        }
    };

    return (
        <div>
        <AdminNavbar/>
        <br />
        <br />
        <br />
        <br />
      
        
        <div className="wrapper">
            <div className="adminhomecontent">
                <h1>Hello Admin</h1>
                <h1>Welcome Back !</h1>
            </div>
            <p></p>
            <div className='carouseladmin'>
            <HomeCarousel />
            <FooterAdmin />
            </div>
        </div>
        </div>
    );
};

export default AuthenticatedAdminHome;
