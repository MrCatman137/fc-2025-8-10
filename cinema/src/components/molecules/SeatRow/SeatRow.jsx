import React from "react";
import Seat from "../../atoms/Seat/Seat";
import "./SeatRow.css"
const SeatRow = ({ seats, rowIndex, selectedSeats, onSeatClick }) => {
  return (
    <div className="seat-row">
      {seats.map((isBooked, seatIndex) => {
        const seatId = rowIndex * seats.length + seatIndex;
        const isSelected = selectedSeats.some(([r, s]) => r === rowIndex && s === seatIndex);

        return (
          <Seat
            key={seatId}
            isBooked={isBooked}
            isSelected={isSelected}
            onClick={() => !isBooked && onSeatClick(rowIndex, seatIndex)}
          />
        );
      })}
    </div>
  );
};

export default SeatRow;
