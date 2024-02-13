import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from '../AdminNavbar';
import Footer from '../Footer';
import './TeamHome.css'; // Ensure to include your TeamHome.css file

const TeamHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the JWT token and role are present in local storage
    const token = localStorage.getItem('jwtToken');
    const roleId = localStorage.getItem('roleId');

    if (!token || roleId !== 'Team') {
      // If token or role is not present or role is not 'Team', show a toast and redirect to the appropriate page
      toast.error('Unauthorized access. Please log in as a team member.');
      navigate('/SignIn'); // Redirect to the sign-in page
    }
  }, [navigate]);

  return (
    <div>
      <AdminNavbar />
      <div className="team-home-content">
        <h1>Hello Team Member</h1>
        <h1>Welcome Back!</h1>
        {/* Add any additional content specific to the team home */}
      </div>
      <Footer />
    </div>
  );
};

export default TeamHome;
