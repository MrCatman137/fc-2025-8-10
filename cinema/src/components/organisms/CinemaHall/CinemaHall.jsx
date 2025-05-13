import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const navigate = useNavigate();

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

    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/check-auth", {
          credentials: "include",
        });
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    fetchSeats();
    checkAuth();
  }, [movieId]);

  const toggleSeat = (rowIndex, seatIndex) => {
    const seatStatus = seats[rowIndex][seatIndex];
    if (seatStatus === "booked") return;

    const isSelected = selectedSeats.some(
      ([r, s]) => r === rowIndex && s === seatIndex
    );

    const updatedSelected = isSelected
      ? selectedSeats.filter(([r, s]) => !(r === rowIndex && s === seatIndex))
      : [...selectedSeats, [rowIndex, seatIndex]];

    setSelectedSeats(updatedSelected);
  };

  const handleBooking = async () => {
    const seatsToBook = selectedSeats.map(([r, s]) => getSeatNumber(r, s));
    
    try {
      const res = await fetch("http://localhost:5000/api/check-auth", {
        credentials: "include",
      });
      const data = await res.json();
  
      if (!data.authenticated) {
        navigate("/guest-booking", {
          state: {
            movieId,
            selectedSeats: seatsToBook, 
          },
        });
        return;
      }
  
      const updated = seats.map((row, rIdx) =>
        row.map((seat, sIdx) =>
          selectedSeats.some(([r, s]) => r === rIdx && s === sIdx)
            ? "booked"
            : seat
        )
      );
  
      await fetch(`http://localhost:5000/api/cinema-hall/${movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ seatsToBook }),
      });
  
      setSeats(updated);
      setSelectedSeats([]); 
    } catch (error) {
      console.error("Error during booking:", error);
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
            <button
              className="book-button"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
            >
              Book selected seats
            </button>

            {selectedSeats.length > 0 && (
              <div className="selected-seats">
                <p className="small-text">Selected seats:</p>
                <ul className="selected-seats-list">
                  {selectedSeats.map(([r, s], index) => (
                    <li key={index}>
                      row {r + 1}, seat {s + 1}
                    </li>
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
