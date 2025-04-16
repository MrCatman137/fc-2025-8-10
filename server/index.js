const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");

const upload = multer({ dest: "uploads/posters" });
const POSTERS_DIR = path.join(__dirname, "uploads");

const app = express();
const port = 5000;

app.use(bodyParser.json());

const moviesFilePath = path.join(__dirname, "data", "movies.json");

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

app.post("/api/movie", async (req, res) => {
  try {
    const { title, description, genre, releaseDate} = req.body;

    if (!title || !description || !genre || !releaseDate) {
      return res.status(400).json({ message: "Missing required movie fields." });
    }
    
    const newMovie = {
        id: "",
        title,
        description,
        genre,
        releaseDate
      };

    const idBase = `${newMovie.title}-${Date.now()}`;
    newMovie.id = crypto.createHash("md5").update(idBase).digest("hex");
    
    let movies = await readMovies();

    movies.push(newMovie);

    await writeMovies(movies);

    res.status(201).json({ message: "Movie added successfully!", movie: newMovie });
  } catch (err) {
    res.status(500).json({ message: "Error adding movie", error: err.message });
  }
});

app.get("/api/movies", async (req, res) => {
    try {
      const movies = await readMovies();
      res.status(200).json(movies);
    } catch (err) {
      res.status(500).json({ message: "Error reading movie list", error: err.message });
    }
  });

  app.post("/api/movie-poster/:id", upload.single("poster"), async (req, res) => {
    const movieId = req.params.id;
    const file = req.file;
  
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    const outputFilePath = path.join(POSTERS_DIR, `${movieId}.webp`);
  
    try {
      await sharp(file.path)
        //.resize(300) 
        .webp({ quality: 80 })
        .toFile(outputFilePath);
  
      fs.unlinkSync(file.path);
  
      res.status(200).json({ message: "Poster uploaded and converted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error processing image", error: error.message });
    }
  });
  
app.get("/api/movie-poster/:id", (req, res) => {
  const movieId = req.params.id;
  const filePath = path.join(POSTERS_DIR, `${movieId}.webp`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Poster not found" });
  }

  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
