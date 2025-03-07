// This file is a bridge for Vercel to correctly route API requests
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Import routes from backend
const authRoutes = require('../backend/routes/auth.routes');
const userRoutes = require('../backend/routes/user.routes');
const songRoutes = require('../backend/routes/song.routes');
const searchRoutes = require('../backend/routes/search.routes');
const playlistRoutes = require('../backend/routes/playlist.routes');

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for music uploads
app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/search', searchRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sonic-stream', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SonicStream API' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handle global errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Export the Express app for Vercel serverless functions
module.exports = app;
