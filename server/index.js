// server.js
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000;

app.use(bodyParser.json());

const moviesFilePath = path.join(__dirname, "..", "cinema", "src", "data", "movies.js");

const readMovies = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(moviesFilePath, "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

const writeMovies = (movies) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2), (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

app.post("/api/add-movie", async (req, res) => {
  try {
    const newMovie = req.body;

    let movies = await readMovies();

    newMovie.id = movies.length + 1;
    movies.push(newMovie);

    await writeMovies(movies);

    res.status(201).json({ message: "Movie added successfully!", movie: newMovie });
  } catch (err) {
    res.status(500).json({ message: "Error adding movie", error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
