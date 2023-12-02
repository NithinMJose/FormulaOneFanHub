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
import TBConfirm from './Components/TicketBooking/TBConfirm';
import TBTicket from './Components/TicketBooking/TBTicket';
import AddTopic from './Components/Topic/AddTopic';
import AddComment from './Components/Topic/AddComment';
import TopicListAdmin from './Components/Topic/TopicListAdmin';
import RaceListAdmin from './Components/Topic/RaceListAdmin';
import UserTBHistory from './Components/TicketBooking/UserTBHistory';
import TopicListUser from './Components/Topic/TopicListUser';
import TopicComment from './Components/Topic/TopicComment';
import AddPoll from './Components/Poll/AddPoll';
import PollList from './Components/Poll/PollList';
import PollListUser from './Components/Poll/PollListUser';
import UserVote from './Components/Poll/UserVote';
import AddGallery from './Components/Gallery/AddGallery';
import GalleryListAdmin from './Components/Gallery/GalleryListAdmin';
import GalleryUserView from './Components/Gallery/GalleryUserView';
import GalleryGuestView from './Components/Gallery/GalleryGuestView';
import UserVoteResult from './Components/Poll/UserVoteResult';
import AddTeamHistory from './Components/TeamHistory/AddTeamHistory';
import TeamHistoryList from './Components/TeamHistory/TeamHistoryList';
import TeamHistoryUserView from './Components/TeamHistory/TeamHistoryUserView';
import CornerListAdmin from './Components/SeasonAndRace/CornerListAdmin';
import UserActiveTBHistory from './Components/TicketBooking/UserActiveTBHistory';
import DriverListGuest from './Components/LoginSignup/DriverListGuest';
import TeamHistoryGuestView from './Components/TeamHistory/TeamHistoryGuestView';
import F1HistoryGuestView from './Components/LoginSignup/F1HistoryGuestView';
import EditTopic from './Components/Topic/EditTopic';
import EditPoll from './Components/Poll/EditPoll';
import EditSeason from './Components/SeasonAndRace/EditSeason';
import EditTeamHistory from './Components/TeamHistory/EditTeamHistory';
import EditRace from './Components/Topic/EditRace';
import EditCorner from './Components/SeasonAndRace/EditCorner';
import EditTicketCategory from './Components/SeasonAndRace/EditTicketCategory';
import TopicListAdminEditView from './Components/Topic/TopicListAdminEditView';
import TopicCommentAdmin from './Components/Topic/TopicCommentAdmin';






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
          <Route path='F1HistoryGuestView' element={<F1HistoryGuestView />} />
          <Route path='/DriverListUser' element={<DriverListUser />} />
          <Route path='/DriverListGuest' element={<DriverListGuest />} />
          <Route path='/AddSeason' element={<AddSeason/>} />
          <Route path='/AddRace' element={<AddRace/>} />
          <Route path='/AddTicketCategory' element={<AddTicketCategory/>} />
          <Route path='/AddCorner' element={<AddCorner/>} />
          <Route path='/CornerListAdmin' element={<CornerListAdmin />} />
          <Route path='/LeftPanel' element={<LeftPanel/>} />
          <Route path='/SeasonList' element={<SeasonList/>} />
          <Route path='/TicketCategoryList' element={<TicketCategoryList/>} />
          <Route path='/TBSeason' element={<TBSeason/>} />
          <Route path='/TBRace' element={<TBRace/>} />
          <Route path='/TBCorner' element={<TBCorner/>} />
          <Route path='/TBCategory' element={<TBCategory/>} />
          <Route path='/TBConfirm' element={<TBConfirm/>} />
          <Route path='/TBTicket' element={<TBTicket/>} />
          <Route path='/AddTopic' element={<AddTopic/>} />
          <Route path='/AddComment' element={<AddComment/>} />
          <Route path='/TopicListAdmin' element={<TopicListAdmin/>} />
          <Route path='/RaceListAdmin' element={<RaceListAdmin/>} />
          <Route path='/UserTBHistory' element={<UserTBHistory/>} />
          <Route path='/UserActiveTBHistory' element={<UserActiveTBHistory/>} />
          <Route path='/TopicListUser' element={<TopicListUser/>} />
          <Route path='/TopicComment' element={<TopicComment />} />
          <Route path='/AddPoll' element={<AddPoll />} />
          <Route path='/PollList' element={<PollList />} />
          <Route path='/PollListUser' element={<PollListUser />} />
          <Route path='/UserVote' element={<UserVote />} />
          <Route path='/UserVoteResult' element={<UserVoteResult />} />
          <Route path='/AddGallery' element={<AddGallery />} />
          <Route path='/GalleryListAdmin' element={<GalleryListAdmin />} />
          <Route path='/GalleryUserView' element={<GalleryUserView />} />
          <Route path='/GalleryGuestView' element={<GalleryGuestView />} />
          <Route path='/AddTeamHistory' element={<AddTeamHistory />} />
          <Route path='/TeamHistoryList' element={<TeamHistoryList />} />
          <Route path='/TeamHistoryUserView' element={<TeamHistoryUserView />} />
          <Route path='/TeamHistoryGuestView' element={<TeamHistoryGuestView />} />
          <Route path='/EditTopic' element={<EditTopic />} />
          <Route path='/EditPoll' element={<EditPoll />} />
          <Route path='/EditSeason' element={<EditSeason />} />
          <Route path='/EditTeamHistory' element={<EditTeamHistory />} />
          <Route path='/EditRace' element={<EditRace/>} />
          <Route path='/EditCorner' element={<EditCorner/>} />
          <Route path='/EditTicketCategory' element={<EditTicketCategory/>} />
          <Route path='/TopicListAdminEditView' element={<TopicListAdminEditView/>} />
          <Route path='/TopicCommentAdmin' element={<TopicCommentAdmin />} />

        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
