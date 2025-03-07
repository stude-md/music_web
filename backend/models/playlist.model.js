const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Playlist name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    coverImage: {
      type: String,
      default: 'default-playlist.jpg'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    songs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    }],
    isPublic: {
      type: Boolean,
      default: true
    },
    plays: {
      type: Number,
      default: 0
    },
    genre: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total duration
playlistSchema.virtual('totalDuration').get(function() {
  return this.songs.reduce((total, song) => total + (song.duration || 0), 0);
});

// Virtual for song count
playlistSchema.virtual('songCount').get(function() {
  return this.songs.length;
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
