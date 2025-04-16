import React from "react";
import PosterImage from "../atoms/PosterImage";
import GenreTag from "../atoms/GenreTag";

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <PosterImage
        src={`http://localhost:5000/api/movie-poster/${movie.id}`}
        alt={movie.title}
      />
      <div className="movie-card-body">
        <h2>{movie.title}</h2>
        <p>{movie.description}</p>
        <GenreTag genre={movie.genre} />
        <p className="release-date">{movie.releaseDate}</p>
      </div>
    </div>
  );
};

export default MovieCard;
