import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Components/LoginSignup/Signup';
import Signin from './Components/LoginSignup/Signin';
import AuthenticatedAdminHome from './Components/LoginSignup/AuthenticatedAdminHome'; // Import AuthenticatedHome
import AuthenticatedUserHome from './Components/LoginSignup/AuthenticatedUserHome';
import Errors from './Components/LoginSignup/Errors';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Signup />} />
                    <Route path="/Signin" element={<Signin />} />
                    <Route path="/AdminHome" element={<AuthenticatedAdminHome />} /> {/* Use AuthenticatedHome */}
                    <Route path="/UserHome" element={<AuthenticatedUserHome />} />
                    <Route path="/Errors" element={<Errors />} />
                </Routes>
                <ToastContainer />
            </div>
        </Router>
    );
}

export default App;
