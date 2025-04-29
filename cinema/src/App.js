import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import Booking from "./components/pages/Booking/Booking";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking/:id" element={<Booking />} />
    </Routes>
  </Router>
);

export default App;
