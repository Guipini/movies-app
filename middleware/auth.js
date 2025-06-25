const User = require("../models/User"); // Require the User model

async function requireAuth(req, res, next) {
  console.log("req.session.userId in requireAuth:", req.session.userId); // Log session ID
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      console.log("User fetched in requireAuth:", user); // Log fetched user
      if (user) {
        req.user = user; // Attach the user object to req.user
        // Explicitly check if req.user is set before proceeding
        if (req.user && req.user._id) {
          next();
        } else {
          // Fallback if req.user somehow isn't set despite finding user
          console.error("req.user not set after finding user in requireAuth");
          req.session.destroy((err) => {
            if (err) console.error(err);
            res.redirect("/auth/login");
          });
        }
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

module.exports = { requireAuth };
