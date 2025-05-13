import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CinemaHall from "../../organisms/CinemaHall/CinemaHall";
import PosterImage from "../../atoms/PosterImage/PosterImage";
import MovieInfo from "../../molecules/MovieInfo/MovieInfo";
import "./Booking.css";

const Booking = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/movie/${id}`);
        console.log("Status code:", res);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

  return (
    <div className="container-book">
      <h1 className="title">Booking seats</h1>

      {movie && (
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
      )}

      <div className="booking-page">
        <CinemaHall movieId={id} />
      </div>
    </div>
  );
};

export default Booking;
