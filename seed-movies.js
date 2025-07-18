require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("./models/Movie");

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/movies-app';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
  seedMovies();
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

const sampleMovies = [
  {
    name: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genres: ["Drama"],
    rating: 9.3,
    description: "Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency."
  },
  {
    name: "The Godfather",
    director: "Francis Ford Coppola", 
    year: 1972,
    genres: ["Crime", "Drama"],
    rating: 9.2,
    description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son."
  },
  {
    name: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    rating: 9.0,
    description: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy."
  },
  {
    name: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
    genres: ["Crime", "Drama"],
    rating: 8.9,
    description: "The lives of two mob hitmen, a boxer, and others intertwine in four tales of violence and redemption."
  },
  {
    name: "Forrest Gump",
    director: "Robert Zemeckis",
    year: 1994,
    genres: ["Drama", "Romance"],
    rating: 8.8,
    description: "A man with low IQ accomplishes great things and is present during significant historic events."
  },
  {
    name: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    rating: 8.8,
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea."
  },
  {
    name: "The Matrix",
    director: "The Wachowskis",
    year: 1999,
    genres: ["Action", "Sci-Fi"],
    rating: 8.7,
    description: "A computer programmer discovers reality as he knows it is actually a simulation."
  },
  {
    name: "Goodfellas",
    director: "Martin Scorsese",
    year: 1990,
    genres: ["Crime", "Drama"],
    rating: 8.7,
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife and his mob partners."
  },
  {
    name: "Interstellar",
    director: "Christopher Nolan",
    year: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    rating: 8.6,
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    name: "Parasite",
    director: "Bong Joon-ho",
    year: 2019,
    genres: ["Comedy", "Drama", "Thriller"],
    rating: 8.6,
    description: "A poor family schemes to become employed by a wealthy family and infiltrate their household."
  },
  {
    name: "The Lion King",
    director: "Roger Allers, Rob Minkoff",
    year: 1994,
    genres: ["Animation", "Adventure", "Drama"],
    rating: 8.5,
    description: "A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery."
  },
  {
    name: "Spirited Away",
    director: "Hayao Miyazaki",
    year: 2001,
    genres: ["Animation", "Adventure", "Family"],
    rating: 9.3,
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods and witches."
  }
];

async function seedMovies() {
  try {
    // Clear existing movies
    console.log("Clearing existing movies...");
    await Movie.deleteMany({});
    
    // Insert sample movies
    console.log("Adding sample movies...");
    const insertedMovies = await Movie.insertMany(sampleMovies);
    
    console.log(`Successfully added ${insertedMovies.length} movies to the database:`);
    insertedMovies.forEach(movie => {
      console.log(`- ${movie.name} (${movie.year})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding movies:", error);
    process.exit(1);
  }
}