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
import About from './Components/LoginSignup/About';
import AboutPage from './Components/LoginSignup/AboutPage';
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
import F1HistoryUpdate from  './Components/LoginSignup/F1HistoryUpdate';
import F1HistoryUserView from './Components/LoginSignup/F1HistoryUserView';
import DriverListUser from './Components/LoginSignup/DriverListUser';
import AddSeason from './Components/SeasonAndRace/AddSeason';
import AddRace from './Components/SeasonAndRace/AddRace';
import AddTicketCategory from './Components/SeasonAndRace/AddTicketCategory';
import AddCorner from './Components/SeasonAndRace/AddCorner';
import LeftPanel from './Components/SeasonAndRace/LeftPanel';
import SeasonList from './Components/SeasonAndRace/SeasonList';
import TicketCategoryList from './Components/SeasonAndRace/TicketCategoryList';
import TBSeason from './Components/TicketBooking/TBSeason';
import TBRace from './Components/TicketBooking/TBRace';
import TBCorner from './Components/TicketBooking/TBCorner';
import TBCategory from './Components/TicketBooking/TBCategory';




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
          <Route path="/AboutPage" element={<AboutPage />} />
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
          <Route path='F1HistoryUserView' element={<F1HistoryUserView />} />
          <Route path='/DriverListUser' element={<DriverListUser />} />
          <Route path='/AddSeason' element={<AddSeason/>} />
          <Route path='/AddRace' element={<AddRace/>} />
          <Route path='/AddTicketCategory' element={<AddTicketCategory/>} />
          <Route path='/AddCorner' element={<AddCorner/>} />
          <Route path='/LeftPanel' element={<LeftPanel/>} />
          <Route path='/SeasonList' element={<SeasonList/>} />
          <Route path='/TicketCategoryList' element={<TicketCategoryList/>} />
          <Route path='/TBSeason' element={<TBSeason/>} />
          <Route path='/TBRace' element={<TBRace/>} />
          <Route path='/TBCorner' element={<TBCorner/>} />
          <Route path='/TBCategory' element={<TBCategory/>} />



          

        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
