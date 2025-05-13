import React from "react";
import { Link } from "react-router-dom"; 
import PosterImage from "../../atoms/PosterImage/PosterImage";
import MovieInfo from "../MovieInfo/MovieInfo";
import "./MovieCard.css"

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
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
      <Link to={`/booking/${movie.id}`} className="booking-link">
        <button className="booking-button">
          Book seat
        </button>
      </Link>
    </div>
  );
};

export default MovieCard;
