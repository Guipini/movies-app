const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render('movies/index', { movies }); // Assuming you'll have an index.pug in movies/
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving movies');
  }
});

// GET form to create new movie
router.get('/new', (req, res) => {
  res.render('movies/new');
});

// POST create new movie
router.post('/', async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.redirect('/movies');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating movie');
  }
});

module.exports = router;
