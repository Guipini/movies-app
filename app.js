require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const methodOverride = require("method-override");
const { requireAuth, loadUser } = require("./middleware/auth");
const { flashMiddleware } = require("./middleware/flash");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/movies-app';
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB connected to: ${process.env.NODE_ENV === 'production' ? 'Atlas Cloud' : 'Local Database'}`);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process on connection failure in production
  });

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method")); // For PUT and DELETE requests
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      touchAfter: 24 * 3600 // lazy session update
    }),
    cookie: { 
      secure: process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'development',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    },
  })
);

// Flash message middleware
app.use(flashMiddleware);

// Make session and environment available in Pug templates
app.use((req, res, next) => {
  res.locals.session = req.session; // This makes req.session accessible as 'session' in pug
  res.locals.process = {
    env: { NODE_ENV: process.env.NODE_ENV || "development" },
  }; // Make NODE_ENV available
  next();
});

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const moviesRouter = require("./routes/movies");

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/movies", loadUser, moviesRouter); // Use loadUser instead of requireAuth for public viewing

// 404 Handler - Must be after all other routes
app.use((req, res, next) => {
  res.status(404).render("error/404", {
    title: "Page Not Found",
    url: req.originalUrl
  });
});

// Error Handling Middleware (should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Render custom 500 page
  res.status(500).render("error/500", {
    title: "Server Error",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
