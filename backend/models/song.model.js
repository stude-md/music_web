const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Song title is required'],
      trim: true
    },
    artist: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true
    },
    album: {
      type: String,
      trim: true
    },
    genre: {
      type: String,
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'Song duration is required']
    },
    coverImage: {
      type: String,
      default: 'default-cover.jpg'
    },
    audioFile: {
      type: String,
      required: [true, 'Audio file is required']
    },
    releaseDate: {
      type: Date,
      default: Date.now
    },
    plays: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    featuredArtists: [{
      type: String,
      trim: true
    }],
    lyrics: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for formatted duration
songSchema.virtual('formattedDuration').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = Math.floor(this.duration % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

// Index for search functionality
songSchema.index({ title: 'text', artist: 'text', album: 'text', genre: 'text' });

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
