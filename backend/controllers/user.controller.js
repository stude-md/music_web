const User = require('../models/user.model');
const Song = require('../models/song.model');
const fs = require('fs');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, fullName } = req.body;
    
    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }
    }
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }
    
    // Update user profile
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (fullName) updates.fullName = fullName;
    
    // Update avatar if uploaded
    if (req.file) {
      // Remove old avatar if it's not the default
      if (req.user.avatar !== 'default-avatar.png' && fs.existsSync(req.user.avatar)) {
        fs.unlinkSync(req.user.avatar);
      }
      updates.avatar = req.file.path;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id);
    
    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add song to favorites
// @route   POST /api/users/favorites/:songId
// @access  Private
exports.addToFavorites = async (req, res) => {
  try {
    const songId = req.params.songId;
    
    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }
    
    // Check if already in favorites
    const user = await User.findById(req.user._id);
    if (user.favorites.includes(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Song already in favorites'
      });
    }
    
    // Add to favorites
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { favorites: songId } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Song added to favorites'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove song from favorites
// @route   DELETE /api/users/favorites/:songId
// @access  Private
exports.removeFromFavorites = async (req, res) => {
  try {
    const songId = req.params.songId;
    
    // Remove from favorites
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: songId } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Song removed from favorites'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        select: 'title artist album genre duration coverImage audioFile plays'
      });
    
    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get recently played songs
// @route   GET /api/users/recently-played
// @access  Private
exports.getRecentlyPlayed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'recentlyPlayed.song',
        select: 'title artist album genre duration coverImage audioFile'
      });
    
    res.status(200).json({
      success: true,
      data: user.recentlyPlayed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upgrade to premium
// @route   POST /api/users/premium
// @access  Private
exports.upgradeToPremium = async (req, res) => {
  try {
    // In a real app, this would include payment processing
    // For demo purposes, we'll just update the user role
    
    // Calculate premium expiry (30 days from now)
    const premiumUntil = new Date();
    premiumUntil.setDate(premiumUntil.getDate() + 30);
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        role: 'premium',
        premiumUntil
      },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Upgraded to premium successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get download credits
// @route   GET /api/users/download-credits
// @access  Private
exports.getDownloadCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('downloadCredits role premiumUntil');
    
    const isPremium = user.role === 'premium' && user.premiumUntil && new Date(user.premiumUntil) > new Date();
    
    res.status(200).json({
      success: true,
      data: {
        downloadCredits: user.downloadCredits,
        isPremium,
        premiumUntil: user.premiumUntil
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
