import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Routes instead of Switch
import SignUp from './SignUp';
import Login from './Login';
import GetUser from './GetUser';
import { UserProvider } from './Context/UserContext';
import Nopage from './NoPage/Nopage';
import Profile from "./Admin/Profile"
import AddTour from './Tour/AddTour';
import UserProfile from './User/Profile';
import TourDetail from './Tour/TourDetail';
import BookTour from './Tour/BookTour';
import HistoryDetail from './Tour/HistoryDetail';

const App = () => {
  return (
    <UserProvider>
      <Router>
      <Routes>
        {/* <Route path="/" element={<SignUp />} /> */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* /<Route path='/adminProfile' element={<AdProfile/>}/> */}
        <Route path='/admin' element={<Profile/>}/>
        <Route path="/" element={<UserProfile/>} />
        <Route path='/addTour' element={<AddTour/>}/>
        <Route path="/Tour-Detail/:name" element={<TourDetail/>}/>
        <Route path="/Book-Tour/:title" element={<BookTour/>}/>
        <Route path='/History-Detail/:tourId' element={<HistoryDetail/>}/>
        <Route path="*" element={<Nopage/>}/>

        {/* <Route path="/getUser" element={<GetUser />} /> */}

      </Routes>
    </Router>
    </UserProvider>
    
  );
};

export default App;
