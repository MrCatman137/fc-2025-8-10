import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import Booking from "./components/pages/Booking/Booking";
import GuestBooking from "./components/pages/GuestBooking/GuestBooking";
import Auth from "./components/pages/Auth/Auth";
import Header from "./components/templates/Header/Header";
import Tickets from "./components/pages/Tickets/Tickets"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <Router>
    <Header />
    <ToastContainer position="top-right" autoClose={500} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/guest-booking" element={<GuestBooking />} />
        <Route path="/tickets" element={<Tickets />} />
        
      </Routes>
    
  </Router>
);

export default App;
