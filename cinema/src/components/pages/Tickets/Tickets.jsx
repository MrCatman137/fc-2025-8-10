import React, { useEffect, useState } from "react";
import PosterImage from "../../atoms/PosterImage/PosterImage";
import MovieInfo from "../../molecules/MovieInfo/MovieInfo";
import "./Tickets.css";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user-tickets", {
          credentials: "include", 
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();

        const movieIds = [...new Set(data.map((item) => item.movieId))];

        const movieMap = {};
        await Promise.all(
          movieIds.map(async (id) => {
            const res = await fetch(`http://localhost:5000/api/movie/${id}`);
            if (res.ok) {
              const movie = await res.json();
              movieMap[id] = movie;
            }
          })
        );

        setTickets(data);
        setMovies(movieMap);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="tickets-container">
      <h1 className="title">My tickets</h1>
      {tickets.length === 0 ? (
        <p className="small-text">You don't have any tickets</p>
      ) : (
        <ul className="ticket-list">
          {tickets.map((ticket, index) => {
            const movie = movies[ticket.movieId];
            return (
              <li key={index} className="ticket-item">
                <div className="movie-info">
                  <PosterImage
                    src={`http://localhost:5000/api/movie-poster/${movie.id}`}
                    alt={movie.title}
                  />
                  <MovieInfo 
                    title={movie.title} 
                    genre={movie.genre} 
                    description={movie.description} 
                    releaseDate={movie.releaseDate} 
                  />
                </div>
                <p className="ticket">
                  Row: {Math.floor((ticket.seat) / 8) + 1}, Seat: {(ticket.seat) % 8 + 1}    
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Tickets;
