const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    fullName: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    role: {
      type: String,
      enum: ['user', 'premium', 'admin'],
      default: 'user'
    },
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    }],
    recentlyPlayed: [{
      song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
      },
      playedAt: {
        type: Date,
        default: Date.now
      }
    }],
    playlists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Playlist'
    }],
    downloadCredits: {
      type: Number,
      default: 5  // Free users get 5 downloads initially
    },
    premiumUntil: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has premium status
userSchema.methods.isPremium = function() {
  return this.role === 'premium' && this.premiumUntil && new Date(this.premiumUntil) > new Date();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
