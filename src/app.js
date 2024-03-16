require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Assuming MongoDB connection details in .env
const cors = require('cors'); // Enable CORS for development
const restaurantsRouter = require('./api/controllers/restaurants'); // Import item controller
const usersRouter = require('./api/controllers/users'); // Import user controller (optional, if separate)
const reviewsRouter = require('./api/controllers/reviews')
const app = express(); // start the express
const port = process.env.PORT || 3000; // Use environment variable for port

// Connect to MongoDB database (replace connection string)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB', err));

const con = mongoose.connection

// Enable CORS for development environment (optional)
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// for log user in and provide with the auth token

// User authentication routes
app.use('/api/v1/users', usersRouter);

// Protected routes requiring authorization (middleware)
// CRUD routes for restaurants
app.use('/api/v1/restaurants', restaurantsRouter);

// CRUD routes for reviews
app.use('/api/v1/reviews', reviewsRouter)

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
