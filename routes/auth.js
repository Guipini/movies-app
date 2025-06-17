const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET registration form
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// POST register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

// GET login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// POST login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    req.session.userId = user._id; // Store user ID in session
    res.redirect('/movies');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});

// POST logout user
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

module.exports = router;
