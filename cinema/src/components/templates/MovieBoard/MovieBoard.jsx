import SearchInput from "../../atoms/SearchInput/SearchInput";
import MovieList from "../../organisms/MovieList/MovieList";
import React, { useState, useEffect } from "react";
import "./MovieBoard.css"
const MovieBoard = () => {
    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState([]);
    
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/movies");
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies();
    }, []);

    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1 className="title">Movie List</h1>
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
            <MovieList movies={filteredMovies} />
        </div>
    );
};
export default MovieBoard;
