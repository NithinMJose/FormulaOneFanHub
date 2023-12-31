import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

    const handleLogout = () => {
        // Remove the JWT token from local storage
        localStorage.removeItem('jwtToken');
        toast.success('Logged out successfully');
        navigate('/Signin'); // Redirect to the login page
    };

    const handleListUsers = async () => {
        try {
            // Make an API request to fetch the list of users
            const response = await fetch('https://localhost:7092/api/Admin/ListUsers', {
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
        <div className="container">
            <h1>Hello Admin</h1>
            <h1>Welcome to the Admin Home Page</h1>
            {/* Add your home page content here */}
            <button className="submit" onClick={handleLogout}>
                Logout
            </button>

            {/* Button to list users */}
            <button className="submit" style={{ backgroundColor: 'red', color: 'white' }} onClick={handleListUsers}>
                List Users
            </button>
        </div>

    {/* Display the list of names in a table outside the container */}
    <div className="user-list">
        <h2>User Names:</h2>
        <table>
            <thead>
            <tr>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
            {users.map((name, index) => (
                <tr key={index}>
                    <td>{name}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
        </div>
);
};

export default AuthenticatedAdminHome;
