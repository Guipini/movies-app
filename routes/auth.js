const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

// GET registration form
router.get("/register", (req, res) => {
  res.render("auth/register", { errors: [], formData: {} });
});

// POST register new user with validation
router.post("/register", [
  body("username")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render("auth/register", {
        errors: errors.array(),
        formData: req.body
      });
    }

    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.render("auth/register", {
        errors: [{ msg: "Username or email already exists" }],
        formData: req.body
      });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    
    req.flash.success("Registration successful! Please log in.");
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.render("auth/register", {
      errors: [{ msg: "Error registering user. Please try again." }],
      formData: req.body
    });
  }
});

// GET login form
router.get("/login", (req, res) => {
  res.render("auth/login", { 
    errors: [], 
    formData: {}
  });
});

// POST login user with validation
router.post("/login", [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render("auth/login", {
        errors: errors.array(),
        formData: req.body
      });
    }

    const { username, password } = req.body;
    
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.render("auth/login", {
        errors: [{ msg: "Invalid username or password" }],
        formData: req.body
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.render("auth/login", {
        errors: [{ msg: "Invalid username or password" }],
        formData: req.body
      });
    }

    req.session.userId = user._id; // Store user ID in session
    req.session.username = user.username; // Store username for convenience
    req.flash.success(`Welcome back, ${user.username}!`);
    res.redirect("/movies");
  } catch (err) {
    console.error(err);
    res.render("auth/login", {
      errors: [{ msg: "Error logging in. Please try again." }],
      formData: req.body
    });
  }
});

// POST logout user
router.post("/logout", (req, res) => {
  req.flash.info("You have been logged out successfully.");
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
  });
});

module.exports = router;
