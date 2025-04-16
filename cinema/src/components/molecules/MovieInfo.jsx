import GenreTag from "../atoms/GenreTag";

const MovieInfo = ({ title, genre, description, releaseDate }) => (
    <div className="movie-card-body">
      <h3>{title}</h3>
      <GenreTag genre={genre} />
      <p>{description}</p>
      <p>Дата: {releaseDate}</p>
    </div>
  );
  
export default MovieInfo;
  