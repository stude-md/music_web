const Song = require('../models/song.model');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
exports.getAllSongs = async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, search, sortBy } = req.query;
    
    // Build query
    const query = {};
    
    // Add genre filter if provided
    if (genre) {
      query.genre = genre;
    }
    
    // Add search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Determine sort order
    let sort = {};
    if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'popular') {
      sort = { plays: -1 };
    } else if (sortBy === 'downloads') {
      sort = { downloads: -1 };
    } else {
      sort = { createdAt: -1 }; // Default sort
    }
    
    // Execute query with pagination
    const songs = await Song.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    // Get total count
    const count = await Song.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: songs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalSongs: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get song by ID
// @route   GET /api/songs/:id
// @access  Public
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('uploadedBy', 'username');
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }
    
    // Increment play count
    song.plays += 1;
    await song.save();
    
    // Add to user's recently played if authenticated
    if (req.user) {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            recentlyPlayed: {
              $each: [{ song: song._id, playedAt: new Date() }],
              $position: 0,
              $slice: 20 // Keep only the last 20 played songs
            }
          }
        }
      );
    }
    
    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upload a new song
// @route   POST /api/songs
// @access  Private
exports.uploadSong = async (req, res) => {
  try {
    const {
      title,
      artist,
      album,
      genre,
      duration,
      releaseDate,
      isPremium,
      featuredArtists,
      lyrics
    } = req.body;
    
    // Check if all required fields are provided
    if (!title || !artist || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, artist, and duration'
      });
    }
    
    // Check if files were uploaded
    if (!req.files || !req.files.audio) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an audio file'
      });
    }
    
    // Create new song
    const newSong = {
      title,
      artist,
      album,
      genre,
      duration: parseFloat(duration),
      audioFile: req.files.audio[0].path,
      releaseDate: releaseDate || Date.now(),
      isPremium: isPremium === 'true',
      uploadedBy: req.user._id
    };
    
    // Add cover image if uploaded
    if (req.files.cover) {
      newSong.coverImage = req.files.cover[0].path;
    }
    
    // Add optional fields if provided
    if (featuredArtists) {
      newSong.featuredArtists = JSON.parse(featuredArtists);
    }
    
    if (lyrics) {
      newSong.lyrics = lyrics;
    }
    
    // Save to database
    const song = await Song.create(newSong);
    
    res.status(201).json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update song
// @route   PUT /api/songs/:id
// @access  Private (Admin or Uploader)
exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }
    
    // Check ownership (admin or original uploader)
    if (
      song.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this song'
      });
    }
    
    // Update song fields
    const {
      title,
      artist,
      album,
      genre,
      releaseDate,
      isPremium,
      featuredArtists,
      lyrics
    } = req.body;
    
    if (title) song.title = title;
    if (artist) song.artist = artist;
    if (album) song.album = album;
    if (genre) song.genre = genre;
    if (releaseDate) song.releaseDate = releaseDate;
    if (isPremium !== undefined) song.isPremium = isPremium === 'true';
    if (featuredArtists) song.featuredArtists = JSON.parse(featuredArtists);
    if (lyrics) song.lyrics = lyrics;
    
    // Update files if provided
    if (req.files) {
      if (req.files.audio) {
        // Delete old file
        if (fs.existsSync(song.audioFile)) {
          fs.unlinkSync(song.audioFile);
        }
        song.audioFile = req.files.audio[0].path;
      }
      
      if (req.files.cover) {
        // Delete old cover
        if (song.coverImage && song.coverImage !== 'default-cover.jpg' && fs.existsSync(song.coverImage)) {
          fs.unlinkSync(song.coverImage);
        }
        song.coverImage = req.files.cover[0].path;
      }
    }
    
    await song.save();
    
    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete song
// @route   DELETE /api/songs/:id
// @access  Private (Admin or Uploader)
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }
    
    // Check ownership (admin or original uploader)
    if (
      song.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this song'
      });
    }
    
    // Delete files
    if (fs.existsSync(song.audioFile)) {
      fs.unlinkSync(song.audioFile);
    }
    
    if (song.coverImage && song.coverImage !== 'default-cover.jpg' && fs.existsSync(song.coverImage)) {
      fs.unlinkSync(song.coverImage);
    }
    
    // Remove from database
    await song.remove();
    
    res.status(200).json({
      success: true,
      message: 'Song deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Download song
// @route   GET /api/songs/:id/download
// @access  Private
exports.downloadSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }
    
    // Check if premium song (only premium users can download premium songs)
    if (song.isPremium && !req.user.isPremium()) {
      return res.status(403).json({
        success: false,
        message: 'This song requires a premium subscription to download'
      });
    }
    
    // Check if regular user has download credits
    if (!req.user.isPremium() && req.user.role !== 'admin') {
      if (req.user.downloadCredits <= 0) {
        return res.status(403).json({
          success: false,
          message: 'You have no download credits left. Upgrade to premium for unlimited downloads.'
        });
      }
      
      // Decrement download credits for non-premium users
      await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { downloadCredits: -1 } }
      );
    }
    
    // Increment download count
    song.downloads += 1;
    await song.save();
    
    // Provide file for download
    const filePath = path.resolve(song.audioFile);
    
    res.download(filePath, `${song.title} - ${song.artist}.mp3`, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error downloading file',
          error: err.message
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
