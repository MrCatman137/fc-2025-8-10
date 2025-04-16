import React from "react";
import PosterImage from "../atoms/PosterImage";
import MovieInfo from "./MovieInfo";

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <PosterImage
        src={`http://localhost:5000/api/movie-poster/${movie.id}`}
        alt={movie.title}
      />
        <MovieInfo title={movie.title} genre={movie.genre} description={movie.description} releaseDate={movie.releaseDate} />
    </div>
  );
};

export default MovieCard;
