import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Components/LoginSignup/Signup';
import Signin from './Components/LoginSignup/Signin';
import AuthenticatedAdminHome from './Components/LoginSignup/AuthenticatedAdminHome';
import { HomePage } from './Components/LoginSignup/HomePage';
import AuthenticatedUserHome from './Components/LoginSignup/AuthenticatedUserHome';
import UserViewProfile from './Components/LoginSignup/UserViewProfile'; // Import UserViewProfile
import UserList from './Components/LoginSignup/UserList'; // Import UserList
import Errors from './Components/LoginSignup/Errors';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { About } from './Components/LoginSignup/About';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Signup" element={<Signup />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/AdminHome" element={<AuthenticatedAdminHome />} />
          <Route path="/UserHome" element={<AuthenticatedUserHome />} />
          <Route path="/UserViewProfile" element={<UserViewProfile />} /> {/* Define the route for UserViewProfile */}
          <Route path="/UserList" element={<UserList />} /> {/* Define the route for UserList */}
          <Route path="/Errors" element={<Errors />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/About" element={<About />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
