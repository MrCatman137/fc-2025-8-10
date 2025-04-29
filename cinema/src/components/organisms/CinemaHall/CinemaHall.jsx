import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SeatRow from "../../molecules/SeatRow/SeatRow";
import "./CinemaHall.css";

const chunkSeats = (seatsArray, rowLength = 8) => {
  const chunked = [];
  for (let i = 0; i < seatsArray.length; i += rowLength) {
    chunked.push(seatsArray.slice(i, i + rowLength));
  }
  return chunked;
};

const CinemaHall = ({ movieId }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [canBook, setCanBook] = useState(true); 

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cinema-hall/${movieId}`);
        
        if (response.status === 404) {
          setCanBook(false); 
          return;
        }

        const data = await response.json();
        const chunkedSeats = chunkSeats(data.seats, 8); 
        setSeats(chunkedSeats);
      } catch (error) {
        console.error("Error fetching seats:", error);
        setCanBook(false); 
      }
    };

    fetchSeats();
  }, [movieId]);

  const toggleSeat = (rowIndex, seatIndex) => {
    const seatStatus = seats[rowIndex][seatIndex];
    if (seatStatus === "booked") return; 

    const isSelected = selectedSeats.some(
      ([r, s]) => r === rowIndex && s === seatIndex
    );

    let updatedSelected;
    if (isSelected) {
      updatedSelected = selectedSeats.filter(([r, s]) => !(r === rowIndex && s === seatIndex));
    } else {
      updatedSelected = [...selectedSeats, [rowIndex, seatIndex]];
    }

    setSelectedSeats(updatedSelected);
  };

  const handleBooking = async () => {
    const updated = seats.map((row, rIdx) =>
      row.map((seat, sIdx) =>
        selectedSeats.some(([r, s]) => r === rIdx && s === sIdx)
          ? "booked"
          : seat
      )
    );

    const seatsToBook = selectedSeats.map(([r, s]) => getSeatNumber(r, s));
    console.log(seatsToBook)
    try {
      await fetch(`http://localhost:5000/api/cinema-hall/${movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatsToBook }), 
      });
      setSeats(updated);
      setSelectedSeats([]);
    } catch (error) {
      console.error("Error updating seats:", error);
    }
  };

  const getSeatNumber = (rowIndex, seatIndex) => {
    return rowIndex * 8 + seatIndex;
  };

  return (
    <div>
      {canBook ? (
        <div>
            <div className="screen">Screen</div>
        
          <div className="cinema-hall">
            {seats.map((row, rowIndex) => (
              <SeatRow
                key={rowIndex}
                seats={row}
                rowIndex={rowIndex}
                selectedSeats={selectedSeats}
                onSeatClick={toggleSeat}
                getSeatNumber={getSeatNumber}  
              />
            ))}
          </div>
          <div className="actions">
            <button className="book-button" onClick={handleBooking} disabled={selectedSeats.length === 0}>
              Book selected seats
            </button>
            {selectedSeats.length > 0 && (
              <div className="selected-seats">
              <p className="small-text">Обрані місця:</p>
              <ul className="selected-seats-list">
                {selectedSeats.map(([r, s], index) => (
                  <li key={index}>ряд {r + 1}, крісло {s + 1}</li>
                ))}
              </ul>
            </div>            
            )}
          </div>
        </div>
      ) : (
        <div className="small-text">
          <p>Booking for this session not available yet</p>
        </div>
      )}
      <Link to="/">
        <button className="go-home-button">Return to home page</button>
      </Link>
    </div>
  );
};

export default CinemaHall;
