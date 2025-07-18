# Movies App

A full-stack web application for managing your personal movie collection. Built with Node.js, Express, MongoDB, and Pug templates.

## Features

- **User Authentication**: Register and login with secure sessions
- **Movie Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Movie Details**: Track name, description, year, rating, and genres
- **Responsive Design**: Modern, clean UI that works on all devices
- **Form Validation**: Input validation with helpful error messages
- **Search & Browse**: Easy navigation through your movie collection

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Pug templating engine, CSS3
- **Authentication**: Express-session with bcrypt password hashing
- **Validation**: Express-validator
- **Additional**: Method-override for REST API support

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Community Edition)
- [Git](https://git-scm.com/) (optional, for cloning)

## Installation & Setup

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd movies-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following:

```env
MONGO_URI=mongodb://localhost:27017/moviesdb
SESSION_SECRET=your-secret-key-here-make-it-long-and-random
PORT=3000
```

**Important**: Replace `your-secret-key-here-make-it-long-and-random` with a strong, unique secret key for session security.

### 4. Set Up MongoDB

#### Option A: Local MongoDB Installation

1. **Install MongoDB Community Edition** from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

2. **Start MongoDB Service**:
   - **Windows**: MongoDB should start automatically after installation, or run `mongod` in command prompt
   - **macOS**: `brew services start mongodb-community` (if installed via Homebrew)
   - **Linux**: `sudo systemctl start mongod`

3. **Verify MongoDB is running**:
   ```bash
   mongo --eval "db.adminCommand('ismaster')"
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get the connection string and update your `.env` file:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/moviesdb?retryWrites=true&w=majority
   ```

### 5. Run the Application

```bash
npm start
```

The application will be available at: `http://localhost:3000`

## Usage

### Getting Started

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Create an account** by clicking "Get Started" or "Create Account"
3. **Login** with your credentials
4. **Add movies** to your collection using the "Add New Movie" button
5. **Browse, edit, or delete** movies from your collection

### Features Overview

- **Home Page**: Welcome screen with quick access to login/register
- **Movies List**: View all your movies with ratings, years, and descriptions
- **Add Movie**: Form to add new movies with validation
- **Movie Details**: View complete information about a specific movie
- **Edit Movie**: Update movie information
- **User Authentication**: Secure login/logout functionality

## Project Structure

```
movies-app/
├── models/
│   ├── Movie.js          # Movie schema and model
│   └── User.js           # User schema and model
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── movies.js         # Movie CRUD routes
│   └── index.js          # Home route
├── views/
│   ├── auth/
│   │   ├── login.pug     # Login form
│   │   └── register.pug  # Registration form
│   ├── movies/
│   │   ├── index.pug     # Movies list
│   │   ├── show.pug      # Movie details
│   │   ├── new.pug       # Add movie form
│   │   └── edit.pug      # Edit movie form
│   ├── partials/
│   │   ├── header.pug    # Navigation header
│   │   └── footer.pug    # Footer
│   ├── layout.pug        # Base template
│   └── index.pug         # Home page
├── middleware/
│   └── auth.js           # Authentication middleware
├── public/
│   ├── css/
│   │   └── style.css     # Application styles
│   ├── js/
│   │   └── main.js       # Client-side JavaScript
│   └── favicon.ico       # Favicon
├── app.js                # Main application file
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (if installed)
- `npm test` - Run tests (if configured)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check your `MONGO_URI` in `.env`
   - Verify MongoDB service status

2. **Port Already in Use**:
   - Change the `PORT` in `.env` to a different number (e.g., 3001)
   - Or kill the process using the port: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

3. **Session Secret Error**:
   - Make sure `SESSION_SECRET` is set in your `.env` file
   - Use a long, random string for security

4. **CSS/Static Files Not Loading**:
   - Ensure the `public` folder structure is correct
   - Check file permissions
   - Restart the server

### Development Mode

For development, you can install `nodemon` for automatic server restarts:

```bash
npm install -g nodemon
nodemon app.js
```

## Security Considerations

- Always use strong session secrets in production
- Never commit `.env` files to version control
- Use HTTPS in production environments
- Implement rate limiting for production use
- Validate and sanitize all user inputs

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Ensure all prerequisites are installed correctly
3. Verify environment variables are set properly
4. Check MongoDB connection and service status

---

**Enjoy managing your movie collection!** 🎬 