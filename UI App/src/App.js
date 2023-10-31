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
import UserConfirmEmail from './Components/LoginSignup/UserConfirmEmail';
import ForgotPass from './Components/LoginSignup/ForgotPassword';
import Register from './Components/LoginSignup/Register';
import Registertwo from './Components/LoginSignup/Registertwo';
import Registerthree from './Components/LoginSignup/Registerthree';
import AddDriver from './Components/LoginSignup/AddDriver';
import DriverList from './Components/LoginSignup/DriverList';
import UpdateDriver from './Components/LoginSignup/UpdateDriver';
import AddF1History from './Components/LoginSignup/AddF1History';
import F1HistoryList from './Components/LoginSignup/F1HistoryList';
import F1HistoryUpdate from './Components/LoginSignup/F1HistoryUpdate';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Register" element={<Signup />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/AdminHome" element={<AuthenticatedAdminHome />} />
          <Route path="/UserHome" element={<AuthenticatedUserHome />} />
          <Route path="/UserViewProfile" element={<UserViewProfile />} /> {/* Define the route for UserViewProfile */}
          <Route path="/UserList" element={<UserList />} /> {/* Define the route for UserList */}
          <Route path="/Errors" element={<Errors />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/About" element={<About />} />
          <Route path="/UserConfirmEmail" element={<UserConfirmEmail />} />
          <Route path='/ForgotPassword' element={<ForgotPass />} />
          <Route path='/Signup' element={<Register />} />
          <Route path='/Registertwo' element={<Registertwo />} />
          <Route path='/Registerthree' element={<Registerthree />} />
          <Route path='/AddDriver' element={<AddDriver />} />
          <Route path='/DriverList' element={<DriverList />} />
          <Route path='/UpdateDriver/:driverId' element={<UpdateDriver />} />
          <Route path='/AddF1History' element={<AddF1History />} />
          <Route path='/F1HistoryList' element={<F1HistoryList />} />
          <Route path='/F1HistoryUpdate/:historyId' element={<F1HistoryUpdate />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
