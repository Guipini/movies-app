const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { requireAuth } = require("../middleware/auth");
const Movie = require("../models/Movie");

// GET all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render("movies/index", { movies, currentUser: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving movies");
  }
});

// GET form to create new movie (requires authentication)
router.get("/new", requireAuth, (req, res) => {
  res.render("movies/new", { movie: null, errors: null });
});

// POST create new movie (requires authentication)
router.post(
  "/",
  requireAuth, // Add authentication requirement
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("year")
      .isInt({ min: 1900, max: 2030 })
      .withMessage("Year must be between 1900 and 2030."),
    body("rating")
      .isFloat({ min: 0, max: 10 })
      .withMessage("Rating must be between 0 and 10."),
    body("genres").custom((value, { req }) => {
      if (value && !Array.isArray(value)) {
        req.body.genres = value.split(",").map((g) => g.trim());
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("movies/new", {
        errors: errors.array(),
        movie: req.body, // Pass back the old input data
      });
    }

    try {
      const newMovie = new Movie(req.body);
      console.log("req.user in POST /movies:", req.user); // Add logging
      if (!req.user || !req.user._id) {
        console.error("req.user is undefined or missing _id in POST /movies");
        return res
          .status(401)
          .send("Authentication required for this operation.");
      }
      newMovie.createdBy = req.user._id; // Assuming req.user is populated by auth middleware
      await newMovie.save();
      req.flash.success(`Movie "${newMovie.name}" has been added successfully!`);
      res.redirect("/movies"); // Redirect to all movies for now, could be /movies/:id
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating movie");
    }
  }
);

// GET movie details
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    res.render("movies/show", { movie, currentUser: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving movie details");
  }
});

// GET form to edit movie (requires authentication)
router.get("/:id/edit", requireAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    if (movie.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("Unauthorized");
    }
    res.render("movies/edit", { movie });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving movie for editing");
  }
});

// PUT update movie (requires authentication)
router.put(
  "/:id",
  requireAuth, // Add authentication requirement
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("year")
      .isInt({ min: 1900, max: 2030 })
      .withMessage("Year must be between 1900 and 2030."),
    body("rating")
      .isFloat({ min: 0, max: 10 })
      .withMessage("Rating must be between 0 and 10."),
    body("genres").custom((value, { req }) => {
      if (value && !Array.isArray(value)) {
        req.body.genres = value.split(",").map((g) => g.trim());
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("movies/edit", {
        errors: errors.array(),
        movie: req.body, // Pass back the old input data
      });
    }

    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).send("Movie not found");
      }
      if (movie.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).send("Unauthorized");
      }
      
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      req.flash.success(`Movie "${updatedMovie.name}" has been updated successfully!`);
      res.redirect(`/movies/${updatedMovie._id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating movie");
    }
  }
);

// DELETE movie (requires authentication)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    if (movie.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("Unauthorized");
    }
    
    const movieName = movie.name; // Store name before deletion
    await Movie.findByIdAndDelete(req.params.id);
    req.flash.success(`Movie "${movieName}" has been deleted successfully.`);
    res.redirect("/movies");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting movie");
  }
});

module.exports = router;
