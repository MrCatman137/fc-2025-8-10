import React from "react";
import "./Seat.css"; 

const Seat = ({ isBooked, isSelected, onClick }) => {
  const getStatusClass = () => {
    if (isBooked) {
      return "seat booked";
    }
    if (isSelected) {
      return "seat selected"; 
    }
    return "seat available"; 
  };

  return (
    <div
      className={getStatusClass()}
      onClick={onClick}
      style={{ cursor: isBooked ? "not-allowed" : "pointer" }}
    >
      {isBooked ? "X" : ""}
    </div>
  );
};


export default Seat;
