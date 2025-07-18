const User = require("../models/User"); // Require the User model

// Middleware that populates req.user if logged in, but doesn't require authentication
async function loadUser(req, res, next) {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        req.user = user; // Attach the user object to req.user
      }
    } catch (err) {
      console.error("Error fetching user in loadUser:", err);
      // Don't redirect on error, just continue without user
    }
  }
  next(); // Always continue, even if no user is logged in
}

// Middleware that requires authentication - redirects if not logged in
async function requireAuth(req, res, next) {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        req.user = user; // Attach the user object to req.user
        next();
      } else {
        // User ID in session but user not found in DB (e.g., deleted)
        req.session.destroy((err) => {
          if (err) console.error(err);
          res.redirect("/auth/login");
        });
      }
    } catch (err) {
      console.error("Error fetching user in requireAuth:", err);
      res.redirect("/auth/login");
    }
  } else {
    // No user ID in session
    res.redirect("/auth/login");
  }
}

module.exports = { requireAuth, loadUser };
