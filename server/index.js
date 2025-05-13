const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const fsPromises = require('fs').promises; 
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const POSTERS_DIR = path.join(__dirname, "uploads", "posters");
const JWT_SECRET = "Uhu27954asd";

const upload = multer({ dest: "uploads/temp" });

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const moviesFilePath = path.join(__dirname, "data", "movies.json");

const readMovies = async () => {
  try {
    const data = await fs.promises.readFile(moviesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    throw new Error("Error while reading new movies");
  }
};

const writeMovies = async (movies) => {
  try {
    await fs.promises.writeFile(moviesFilePath, JSON.stringify(movies, null, 2));
  } catch (err) {
    throw new Error("Error while writing new movies");
  }
};

app.post('/api/movie', upload.single('poster'), async (req, res) => {
  try {
    const { title, description, genre, releaseDate } = req.body;
    const file = req.file;

    if (!title || !description || !genre || !releaseDate) {
      return res.status(400).json({ message: 'Missing required movie fields.' });
    }

    const idBase = `${title}-${Date.now()}`;
    const movieId = crypto.createHash('md5').update(idBase).digest('hex');

    const newMovie = {
      id: movieId,
      title,
      description,
      genre,
      releaseDate,
    };

    if (file) {
      const outputFilePath = path.join(POSTERS_DIR, `${movieId}.webp`);

      try {
        sharp.cache(false);
        await sharp(file.path)
          .webp({ quality: 80 })
          .resize({
            width: 250,         
            height: 500,        
            fit: 'inside',      
            withoutEnlargement: true, 
          })
          .toFile(outputFilePath);
        await fsPromises.unlink(file.path);

      } catch (err) {
        console.error('Error processing poster image:', err);
      }
    }

    const movies = await readMovies();
    movies.push(newMovie);
    await writeMovies(movies);

    res.status(201).json({ message: 'Movie added successfully!', movie: newMovie });
  } catch (err) {
    res.status(500).json({ message: 'Error adding movie', error: err.message });
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
      sharp.cache(false);

      await sharp(file.path)
          .webp({ quality: 80 })
          .toFile(outputFilePath);
      console.log(file.path)
      console.log(outputFilePath)
      
      await fsPromises.unlink(file.path);  

      res.status(200).json({ message: "Poster uploaded and converted successfully" });
  } catch (error) {
      console.error("Error processing image", error);
      res.status(500).json({ message: "Error processing image", error: error.message });
  }
});
/*
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
});*/

app.get("/api/movies", async (req, res) => {
    try {
      const movies = await readMovies();
      res.status(200).json(movies);
    } catch (err) {
      res.status(500).json({ message: "Error reading movie list", error: err.message });
    }
  });

  app.get("/api/movie/:id", async (req, res) => {
    const movieId = req.params.id;
      try {
      const movies = await readMovies();
      const movie = movies.find((item) => item.id === movieId);
      res.status(200).json(movie);

    } catch (err) {
      res.status(500).json({ message: "Error reading movie list", error: err.message });
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

const hallPLacesFilePath = path.join(__dirname, "data", "hall_places.json");

const readHallPLaces = async () => {
  try {
    const data = await fs.promises.readFile(hallPLacesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    throw new Error("Error while reading sessions");
  }
};

const writeHallPLaces = async (places) => {
  try {
    await fs.promises.writeFile(hallPLacesFilePath, JSON.stringify(places, null, 2));
  } catch (err) {
    throw new Error("Error while writing sessions");
  }
};


app.get("/api/cinema-hall/:id", async (req,res) => {
  const movieId = req.params.id;

  try {
    const hall_places = await readHallPLaces();

    const session = hall_places.find((item) => item.id === movieId);

    if (!session) {
      return res.status(404).json({ message: "Session is not found" });
    }

    res.json(session);

  } catch (err) {
    res.status(500).json({ message: "Error getting movie information", error: err.message });
  }

})

app.post("/api/cinema-hall/:id", async (req, res) => {
  const movieId = req.params.id;
  const totalSeats = 40; 

  try {
    const hall_places = await readHallPLaces();

    const exists = hall_places.some(item => String(item.id) === String(movieId));
    if (exists) {
      return res.status(400).json({ message: "Session already exists" });
    }

    const newSession = {
      id: movieId,
      seats: Array(totalSeats).fill(false), 
    };

    hall_places.push(newSession);
    await writeHallPLaces(hall_places);

    res.status(201).json({ message: "Create new session", session: newSession });
  } catch (err) {
    res.status(500).json({ message: "Error creating session", error: err.message });
  }
});

const bookingFilePath = path.join(__dirname, "data", "booking.json");

const readBooking = async () => {
  try {
    const data = await fs.promises.readFile(bookingFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    throw new Error("Error while reading booking");
  }
};

const writeBooking = async (places) => {
  try {
    await fs.promises.writeFile(bookingFilePath, JSON.stringify(places, null, 2));
  } catch (err) {
    throw new Error("Error while writing bookin");
  }
};


app.put("/api/cinema-hall/:id", async (req, res) => {
  const movieId = req.params.id;
  const seatsToBook = req.body.seatsToBook;
  const userId = req.cookies.userId;

  if (!req.cookies.userId) { 
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (!Array.isArray(seatsToBook)) {
    return res.status(400).json({ message: "Invalid format of the places array" });
  }

  try {
    const hall_places = await readHallPLaces();
    const session = hall_places.find(item => String(item.id) === String(movieId));

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    for (let index of seatsToBook) {
      if (index < 0 || index >= session.seats.length) {
        return res.status(400).json({ message: `Place with index ${index} does not exist` });
      }

      if (session.seats[index] === true) {
        return res.status(400).json({ message: `PLace #${index + 1} is already booked` });
      }
    }

    for (let index of seatsToBook) {
      session.seats[index] = true;
    }

    await writeHallPLaces(hall_places);

    const bookings = await readBooking();
    const newBookings = seatsToBook.map(index => ({
      userId,
      movieId,
      seat: index
    }));
    bookings.push(...newBookings);
    
    await writeBooking(bookings);

    res.status(200).json({ message: "Places are booked", seats: session.seats });
  } catch (err) {
    res.status(500).json({ message: "Error udpdate places", error: err.message });
  }
});


app.post("/api/guest-booking/:id", async (req, res) => {
  const movieId = req.params.id;
  const {email, phone, name} = req.body;
  const seatsToBook = req.body.seatsToBook;
  
  if (!name || !phone || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!Array.isArray(seatsToBook)) {
    return res.status(400).json({ message: "Invalid format of the places array" });
  }

  try {
    const hall_places = await readHallPLaces();
    const session = hall_places.find(item => String(item.id) === String(movieId));

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    for (let index of seatsToBook) {
      if (index < 0 || index >= session.seats.length) {
        return res.status(400).json({ message: `Place with index ${index} does not exist` });
      }

      if (session.seats[index] === true) {
        return res.status(400).json({ message: `PLace #${index + 1} is already booked` });
      }
    }

    for (let index of seatsToBook) {
      session.seats[index] = true;
    }

    await writeHallPLaces(hall_places);
    
    const bookings = await readBooking();
    const newBookings = seatsToBook.map(index => ({
      name,
      phone,
      email,
      movieId,
      seat: index
    }));
    bookings.push(...newBookings);
    console.log(bookings)
    await writeBooking(bookings);

    res.status(200).json({ message: "Places are booked", seats: session.seats });
  } catch (err) {
    res.status(500).json({ message: "Error udpdate places", error: err.message });
  }
});



app.get("/api/user-tickets", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  let bookings = [];

  bookings = await readBooking();
  
  const userBookings = bookings
    .filter((b) => b.userId === userId)
    .map(({ movieId, seat }) => ({ movieId, seat }));

  res.json(userBookings);
})

const usersFilePath = path.join(__dirname, "data", "users.json");

const readUsers = async () => {
  try {
    const data = await fs.promises.readFile(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    throw new Error("Error while reading users");
  }
};

const writeUsers = async (places) => {
  try {
    await fs.promises.writeFile(usersFilePath, JSON.stringify(places, null, 2));
  } catch (err) {
    throw new Error("Error while writing users");
  }
};

const generateUserId = (email, hashedPassword) => {
  return crypto.createHash("sha256").update(email + hashedPassword).digest("hex");
};

app.post("/api/register", async (req, res) => {
  const { name, phone, email, password } = req.body;
  
  if (!name || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  try {
    const users = await readUsers();

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUserId(email, hashedPassword);

    const newUser = { id: userId, name, phone, email, password: hashedPassword };
    users.push(newUser);
    await writeUsers(users);

    res.cookie("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await readUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Uncorrect password" });
    }

    res.cookie("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Successfull login" });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.get("/api/check-auth", (req, res) => {
  const isAuthenticated = Boolean(req.cookies?.userId); 

  res.json({ authenticated: isAuthenticated });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("userId", { path: "/" }); 
  res.status(200).json({ message: "Logged out" });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
