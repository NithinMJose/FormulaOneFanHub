import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Components/LoginSignup/Signup';
import Signin from './Components/LoginSignup/Signin';
import AuthenticatedHome from './Components/LoginSignup/AuthenticatedHome'; // Import AuthenticatedHome
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
                    <Route path="/Home" element={<AuthenticatedHome />} /> {/* Use AuthenticatedHome */}
                    <Route path="/Errors" element={<Errors />} />
                </Routes>
                <ToastContainer />
            </div>
        </Router>
    );
}

export default App;
