require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");
const { requireAuth } = require("./middleware/auth");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method")); // For PUT and DELETE requests
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Make session available in Pug templates
app.use((req, res, next) => {
  res.locals.session = req.session; // This makes req.session accessible as 'session' in pug
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
app.use("/movies", requireAuth, moviesRouter);

// Error Handling Middleware (should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
