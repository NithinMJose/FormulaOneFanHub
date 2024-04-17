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
import AboutPage from './Components/LoginSignup/AboutPage';
import UserConfirmEmail from './Components/LoginSignup/UserConfirmEmail';
import ForgotPass from './Components/LoginSignup/ForgotPassword';
import Register from './Components/LoginSignup/Register';
import Registertwo from './Components/LoginSignup/Registertwo';
import Registerthree from './Components/LoginSignup/Registerthree';
import AddDriver from './Components/Driver/AddDriver';
import DriverList from './Components/Driver/DriverList';
import UpdateDriver from './Components/Driver/UpdateDriver';
import AddF1History from './Components/LoginSignup/AddF1History';
import F1HistoryList from './Components/F1History/F1HistoryList';
import F1HistoryUpdate from  './Components/F1History/F1HistoryUpdate';
import F1HistoryUserView from './Components/F1History/F1HistoryUserView';
import DriverListUser from './Components/Driver/DriverListUser';
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
import DriverListGuest from './Components/Driver/DriverListGuest';
import TeamHistoryGuestView from './Components/TeamHistory/TeamHistoryGuestView';
import F1HistoryGuestView from './Components/F1History/F1HistoryGuestView';
import EditTopic from './Components/Topic/EditTopic';
import EditPoll from './Components/Poll/EditPoll';
import EditSeason from './Components/SeasonAndRace/EditSeason';
import EditTeamHistory from './Components/TeamHistory/EditTeamHistory';
import EditRace from './Components/Topic/EditRace';
import EditCorner from './Components/SeasonAndRace/EditCorner';
import EditTicketCategory from './Components/SeasonAndRace/EditTicketCategory';
import TopicListAdminEditView from './Components/Topic/TopicListAdminEditView';
import TopicCommentAdmin from './Components/Topic/TopicCommentAdmin';
import TBConfirm2 from './Components/TicketBooking/TBConfirm2';
import TBConfirm3 from './Components/TicketBooking/TBConfirm3';
import FinalPage from './Components/TicketBooking/FinalPage';
import AdminViewProfile from './Components/LoginSignup/AdminViewProfile';
import AddTeam from './Components/Team/AddTeam';
import AdminSidebar from './Components/sidebar/adminSidebar';
import TeamList from './Components/Team/TeamList';
import TeamViewProfile from './Components/Team/TeamViewProfile';
import AddProductCategory from './Components/Store/AddProductCategory';
import ProductCategoryList from './Components/Store/ProductCategoryList';
import UpdateProductCategory from './Components/Store/UpdateProductCategory';
import TeamHome from './Components/LoginSignup/Team/TeamHome';
import AddDriverTeam from './Components/Driver/AddDriverTeam';
import DriverListTeam from './Components/Driver/DriverListTeam';
import TeamHistoryListTeam from './Components/TeamHistory/TeamHistoryListTeam';
import TopicListTeam from './Components/Topic/TopicListTeam';
import EditTopicTeam from './Components/Topic/EditTopicTeam';
import UpdateTeam from './Components/Team/UpdateTeam';
import UpdateDriverTeam from './Components/Driver/UpdateDriverTeam';
import AddTopicTeam from './Components/Topic/AddTopicTeam';
import AddProductTeam from './Components/Store/AddProductTeam';
import ProductListTeam from './Components/Store/ProductListTeam';
import UpdateProductTeam from './Components/Store/UpdateProductTeam';
import UserSelectCategory from './Components/Store/UserPages/UserSelectCategory';
import UserProducts from './Components/Store/UserPages/UserProducts';
import ProductDetails from './Components/Store/UserPages/ProductDetails';
import UserCart from './Components/Store/UserPages/UserCart';
import UserWishList from './Components/Store/UserPages/UserWishList';
import BuyingFinalPage from './Components/Store/BuyingFinalPage'; 
import OrderHistory from './Components/Store/UserPages/OrderHistory';
import TeamSellingHistory from './Components/Team/TeamSellingHistory';
import UpdateProductStock from './Components/Store/UpdateProductStock';
import DirectBuyingFinalPage from './Components/Store/DirectBuyingFinalPage';
import OrderDetails from './Components/Store/UserPages/OrderDetails';
import AddDeliveryCompany from './Components/Store/DeliveryCompany/AddDeliveryCompany';
import DeliveryCompanyList from './Components/Store/DeliveryCompany/DeliveryCompanyList';
import EditDeliveryCompany from './Components/Store/DeliveryCompany/EditDeliveryCompany';
import DeliveryCompanyHome from './Components/Store/DeliveryCompany/DeliveryCompanyHome';
import ListPendingOrders from './Components/Store/DeliveryCompany/ListPendingOrders';
import ListShippingOrders from './Components/Store/DeliveryCompany/ListShippingOrders';
import TeamSellingReport from './Components/Team/TeamSellingReport';
import EditGallery from './Components/Gallery/EditGallery';
import AccessCamera from './Components/Seminar/AccessCamera';
import AttendanceRegister from './Components/LoginSignup/AttendanceRegister'
import AttendanceRegisterAdmin from './Components/LoginSignup/AttendanceRegisterAdmin'
import AttendanceRegisterExitCamera from './Components/LoginSignup/AttendanceRegisterExitCamera';
import AttendanceRegisterEntranceCamera from './Components/LoginSignup/AttendanceRegisterEntranceCamera';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Register" element={<Signup />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/AdminHome" element={<AuthenticatedAdminHome />} />
          <Route path="/TeamHome" element={<TeamHome />} />
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
          <Route path='/UpdateDriver' element={<UpdateDriver />} />
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
          <Route path='/TBRace/:uniqueSeasonName' element={<TBRace/>} />
          <Route path='/TBCorner/:uniqueRaceName' element={<TBCorner/>} />
          <Route path='/TBCategory/:uniqueCornerName' element={<TBCategory/>} />
          <Route path='/TBConfirm' element={<TBConfirm/>} />
          <Route path='/TBTicket' element={<TBTicket/>} />
          <Route path='/AddTopic' element={<AddTopic/>} />
          <Route path='/AddTopicTeam' element={<AddTopicTeam/>} />
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
          <Route path='/TBConfirm2' element={<TBConfirm2 />} />
          <Route path='/TBConfirm3' element={<TBConfirm3 />} />
          <Route path='/FinalPage' element={<FinalPage />} />
          <Route path='/AdminViewProfile' element={<AdminViewProfile />} />
          <Route path='/AddTeam' element={<AddTeam />} />
          <Route path='/sidebar' element={<AdminSidebar/>} />
          <Route path='/TeamList' element={ <TeamList/>} />
          <Route path='/TeamViewProfile' element={ <TeamViewProfile />} />
          <Route path='/AddProductCategory' element={ <AddProductCategory />} />
          <Route path='/ProductCategoryList' element={ <ProductCategoryList />} />
          <Route path='/UpdateProductCategory' element={ <UpdateProductCategory />} />
          <Route path='/AddDriverTeam' element={ <AddDriverTeam />} />
          <Route path='/DriverListTeam' element={ <DriverListTeam />} />
          <Route path='/TeamHistoryListTeam' element={ <TeamHistoryListTeam />} />
          <Route path='/TopicListTeam' element={ <TopicListTeam />} />
          <Route path='/EditTopicTeam' element={<EditTopicTeam />} />
          <Route path='/UpdateTeam' element={<UpdateTeam />} />
          <Route path='/UpdateDriverTeam' element={<UpdateDriverTeam />} />
          <Route path='/AddProductTeam' element={<AddProductTeam />} />
          <Route path='/ProductListTeam' element={<ProductListTeam />} />
          <Route path='/UpdateProductTeam' element={<UpdateProductTeam />} />
          <Route path='/UserSelectCategory' element={<UserSelectCategory />} />
          <Route path='/UserProducts/:categoryId' element={<UserProducts />} />
          <Route path='/ProductDetails/:productId' element={<ProductDetails />} />
          <Route path='/UserCart' element={<UserCart />} />
          <Route path='/UserWishList' element={<UserWishList />} />
          <Route path='/BuyingFinalPage' element={<BuyingFinalPage />} />
          <Route path='/OrderHistory' element={<OrderHistory />} />
          <Route path='/TeamSellingHistory' element={<TeamSellingHistory />} />
          <Route path='/UpdateProductStock' element={<UpdateProductStock />} />       
          <Route path='/DirectBuyingFinalPage' element={<DirectBuyingFinalPage />} />   
          <Route path='/OrderDetails/:uniqueId' element={<OrderDetails />} />
          <Route path='/AddDeliveryCompany' element={<AddDeliveryCompany />} />
          <Route path='/DeliveryCompanyList' element={<DeliveryCompanyList />} />
          <Route path='/EditDeliveryCompany/:uniqueName' element={<EditDeliveryCompany />} />
          <Route path='/DeliveryCompanyHome' element={<DeliveryCompanyHome />} />
          <Route path='/ListPendingOrders' element={<ListPendingOrders />} />
          <Route path='/ListShippingOrders' element={<ListShippingOrders />} />
          <Route path='/TeamSellingReport' element={<TeamSellingReport />} />
          <Route path='/EditGallery/:uniqueName' element={<EditGallery />} />
          <Route path='/AccessCamera' element={<AccessCamera />} />
          <Route path='/AttendanceRegister' element={<AttendanceRegister />} />
          <Route path='/AttendanceRegisterAdmin' element={<AttendanceRegisterAdmin />} />
          <Route path='/AttendanceRegisterExitCamera' element={<AttendanceRegisterExitCamera />} />
          <Route path='/AttendanceRegisterEntranceCamera' element={<AttendanceRegisterEntranceCamera />} />

        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
