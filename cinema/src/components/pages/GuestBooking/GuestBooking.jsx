import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "./GuestBooking.css";

const GuestBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");

  const handleGuestBooking = async () => {
    if (!email) return alert("Enter your email.");
    if (!userName) return alert("Enter your name.");
    if (!phone) return alert("Enter your phone.");

    try {
      await fetch(`http://localhost:5000/api/guest-booking/${state.movieId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email,
          phone,
          seatsToBook: state.selectedSeats,
        }),
      });

      toast.success("Succesful booking");
            setTimeout(() => {
              window.location.href = "/";
            }, 1000);
    } catch (error) {
      console.error("Error while booking:", error);
    }
  };

  const renderSelectedSeats = () => {
    return state.selectedSeats.map((seat, index) => {
      const row = Math.floor(seat / 8) + 1; 
      const column = (seat % 8) + 1; 
      return (
        <li key={index}>
          Row {row}, Seat {column}
        </li>
      );
    });
  };

  return (
    <div className="guest-booking">
      <h2 className="title">Guest booking</h2>
      <p className="small-text">Enter all the necessary information to confirm your booking:</p>
      <input className="data-input"
        type="name"
        placeholder="Maks"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <input className="data-input"
        type="email"
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input className="data-input"
        type="phone"
        placeholder="0683494375"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <h3 className="small-text">Selected seats:</h3>
      <ul className="selected-seats-list">
        {renderSelectedSeats()}
      </ul>

      <button onClick={handleGuestBooking} className="booking-button">Confirm booking</button>
    </div>
  );
};

export default GuestBooking;
