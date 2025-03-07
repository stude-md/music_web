const Playlist = require('../models/playlist.model');
const User = require('../models/user.model');
const Song = require('../models/song.model');
const fs = require('fs');

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic, genre, tags } = req.body;
    
    // Check if playlist name is provided
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Playlist name is required'
      });
    }
    
    // Create new playlist
    const newPlaylist = {
      name,
      description,
      createdBy: req.user._id,
      isPublic: isPublic === 'true',
      genre
    };
    
    // Add cover image if uploaded
    if (req.file) {
      newPlaylist.coverImage = req.file.path;
    }
    
    // Add tags if provided
    if (tags) {
      newPlaylist.tags = JSON.parse(tags);
    }
    
    // Save to database
    const playlist = await Playlist.create(newPlaylist);
    
    // Add to user's playlists
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { playlists: playlist._id } }
    );
    
    res.status(201).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all public playlists
// @route   GET /api/playlists
// @access  Public
exports.getPublicPlaylists = async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, sortBy } = req.query;
    
    // Build query for public playlists
    const query = { isPublic: true };
    
    // Add genre filter if provided
    if (genre) {
      query.genre = genre;
    }
    
    // Determine sort order
    let sort = {};
    if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'popular') {
      sort = { plays: -1 };
    } else if (sortBy === 'mostSongs') {
      sort = { 'songs.length': -1 };
    } else {
      sort = { createdAt: -1 }; // Default sort
    }
    
    // Execute query with pagination
    const playlists = await Playlist.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username')
      .exec();
    
    // Get total count
    const count = await Playlist.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: playlists,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPlaylists: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's playlists
// @route   GET /api/playlists/my-playlists
// @access  Private
exports.getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .exec();
    
    res.status(200).json({
      success: true,
      data: playlists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get playlist by ID
// @route   GET /api/playlists/:id
// @access  Mixed (Public or Private depending on playlist)
exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('songs');
    
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Check if private playlist
    if (!playlist.isPublic) {
      // Only allow creator to access
      if (!req.user || playlist.createdBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'This playlist is private'
        });
      }
    }
    
    // Increment play count
    playlist.plays += 1;
    await playlist.save();
    
    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private (Creator only)
exports.updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Check ownership
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this playlist'
      });
    }
    
    // Update playlist fields
    const { name, description, isPublic, genre, tags } = req.body;
    
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic === 'true';
    if (genre) playlist.genre = genre;
    if (tags) playlist.tags = JSON.parse(tags);
    
    // Update cover image if uploaded
    if (req.file) {
      // Delete old cover
      if (playlist.coverImage && playlist.coverImage !== 'default-playlist.jpg' && fs.existsSync(playlist.coverImage)) {
        fs.unlinkSync(playlist.coverImage);
      }
      playlist.coverImage = req.file.path;
    }
    
    await playlist.save();
    
    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private (Creator only)
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Check ownership
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this playlist'
      });
    }
    
    // Delete cover image if not default
    if (playlist.coverImage && playlist.coverImage !== 'default-playlist.jpg' && fs.existsSync(playlist.coverImage)) {
      fs.unlinkSync(playlist.coverImage);
    }
    
    // Remove from database
    await playlist.remove();
    
    // Remove from user's playlists
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { playlists: playlist._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs/:songId
// @access  Private (Creator only)
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;
    
    // Check if playlist exists
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Check ownership
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this playlist'
      });
    }
    
    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }
    
    // Check if song is already in playlist
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Song already in playlist'
      });
    }
    
    // Add song to playlist
    playlist.songs.push(songId);
    await playlist.save();
    
    res.status(200).json({
      success: true,
      message: 'Song added to playlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private (Creator only)
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;
    
    // Check if playlist exists
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Check ownership
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this playlist'
      });
    }
    
    // Remove song from playlist
    playlist.songs = playlist.songs.filter(song => song.toString() !== songId);
    await playlist.save();
    
    res.status(200).json({
      success: true,
      message: 'Song removed from playlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
