const MovieInfo = ({ title, description, releaseDate }) => (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Дата: {releaseDate}</p>
    </div>
  );
  
export default MovieInfo;
  