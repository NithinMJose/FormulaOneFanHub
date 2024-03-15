import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import Footer from '../Footer';
import TeamSidebar from '../../sidebar/TeamSidebar'; // Import the AdminSidebar component
import './TeamHome.css'; // Ensure to include your TeamHome.css file
import jwt_decode from 'jwt-decode';
import TeamNavbar from './TeamNavbar';
import { BrowserRouter as Router, Switch, Route, Link,  } from 'react-router-dom';


const BackButtonListner = ({ children }) => {
  React.useEffect(() => {
     const handleBackButton = () => {
       console.log("Hello World");
     };
 
     window.onpopstate = handleBackButton;
 
     return () => {
       window.onpopstate = null; // Clean up the event listener
     };
  }, []);
 
  return (
     <div>
       {children}
     </div>
  );
 };
 

const TeamHome = () => {
  useEffect(() => {
    // Check if the JWT token is present in local storage
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      // If token is not present, show a toast and redirect to the sign-in page
      toast.error('Unauthorized access. Please log in as a team member.');
      // Redirect to the sign-in page
      window.location.replace('/SignIn');
      return; // Exit early
    }

    // Decode the JWT token to get user information
    const decodedToken = jwt_decode(token);
    const roleId = decodedToken.RoleId;

    if (roleId !== 'Team') {
      // If the role is not 'Team', show a toast and redirect to the appropriate page
      toast.error('Unauthorized access. Please log in as a team member.');
      // Redirect to the appropriate page
      window.location.replace('/SignIn');
    }

    const handleBeforeUnload = (event) => {
      const confirmationMessage = 'Are you sure you want to leave?';
      (event || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <TeamNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="container-fluid">
        <div className="row">
          <TeamSidebar /> {/* Display the AdminSidebar component as a sidebar */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="team-home-content">
              <h1>Hello Team Member</h1>
              <h1>Welcome Back!</h1>
              {/* Add any additional content specific to the team home */}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeamHome;
