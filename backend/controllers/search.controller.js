const axios = require('axios');

// Deezer API base URL
const DEEZER_API_URL = 'https://api.deezer.com';

// @desc    Search for tracks on Deezer
// @route   GET /api/search/tracks
// @access  Public
exports.searchTracks = async (req, res) => {
  try {
    const { query, limit = 20, index = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const response = await axios.get(`${DEEZER_API_URL}/search`, {
      params: {
        q: query,
        limit,
        index
      }
    });
    
    // Format the response to match our app's structure
    const tracks = response.data.data.map(track => ({
      id: `deezer_${track.id}`,
      title: track.title,
      artist: track.artist.name,
      album: track.album.title,
      duration: track.duration,
      coverImage: track.album.cover_medium || track.album.cover,
      audioSrc: track.preview,
      source: 'deezer',
      artistId: track.artist.id,
      albumId: track.album.id,
      releaseDate: track.release_date
    }));
    
    res.status(200).json({
      success: true,
      data: tracks,
      total: response.data.total,
      next: response.data.next ? parseInt(index) + parseInt(limit) : null
    });
  } catch (error) {
    console.error('Deezer API error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Error searching tracks',
      error: error.response ? error.response.data : error.message
    });
  }
};

// @desc    Get track details from Deezer
// @route   GET /api/search/tracks/:id
// @access  Public
exports.getTrackDetails = async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Track ID is required'
      });
    }
    
    // Extract the Deezer ID if it's in our format
    const deezerIdMatch = id.match(/^deezer_(\d+)$/);
    const trackId = deezerIdMatch ? deezerIdMatch[1] : id;
    
    const response = await axios.get(`${DEEZER_API_URL}/track/${trackId}`);
    
    // Format the response
    const track = {
      id: `deezer_${response.data.id}`,
      title: response.data.title,
      artist: response.data.artist.name,
      album: response.data.album.title,
      duration: response.data.duration,
      coverImage: response.data.album.cover_medium || response.data.album.cover,
      audioSrc: response.data.preview,
      source: 'deezer',
      artistId: response.data.artist.id,
      albumId: response.data.album.id,
      releaseDate: response.data.release_date,
      bpm: response.data.bpm,
      genres: response.data.genres ? response.data.genres.data.map(g => g.name) : []
    };
    
    res.status(200).json({
      success: true,
      data: track
    });
  } catch (error) {
    console.error('Deezer API error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Error getting track details',
      error: error.response ? error.response.data : error.message
    });
  }
};

// @desc    Search for artists on Deezer
// @route   GET /api/search/artists
// @access  Public
exports.searchArtists = async (req, res) => {
  try {
    const { query, limit = 20, index = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const response = await axios.get(`${DEEZER_API_URL}/search/artist`, {
      params: {
        q: query,
        limit,
        index
      }
    });
    
    // Format the response
    const artists = response.data.data.map(artist => ({
      id: artist.id,
      name: artist.name,
      picture: artist.picture_medium || artist.picture,
      fans: artist.nb_fan,
      albums: artist.nb_album,
      source: 'deezer'
    }));
    
    res.status(200).json({
      success: true,
      data: artists,
      total: response.data.total,
      next: response.data.next ? parseInt(index) + parseInt(limit) : null
    });
  } catch (error) {
    console.error('Deezer API error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Error searching artists',
      error: error.response ? error.response.data : error.message
    });
  }
};

// @desc    Get artist details from Deezer
// @route   GET /api/search/artists/:id
// @access  Public
exports.getArtistDetails = async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Artist ID is required'
      });
    }
    
    // Get artist details
    const artistResponse = await axios.get(`${DEEZER_API_URL}/artist/${id}`);
    
    // Get artist top tracks
    const tracksResponse = await axios.get(`${DEEZER_API_URL}/artist/${id}/top`);
    
    // Format tracks
    const tracks = tracksResponse.data.data.map(track => ({
      id: `deezer_${track.id}`,
      title: track.title,
      artist: track.artist.name,
      album: track.album.title,
      duration: track.duration,
      coverImage: track.album.cover_medium || track.album.cover,
      audioSrc: track.preview,
      source: 'deezer'
    }));
    
    // Format artist
    const artist = {
      id: artistResponse.data.id,
      name: artistResponse.data.name,
      picture: artistResponse.data.picture_medium || artistResponse.data.picture,
      bigPicture: artistResponse.data.picture_xl || artistResponse.data.picture_big,
      fans: artistResponse.data.nb_fan,
      albums: artistResponse.data.nb_album,
      topTracks: tracks,
      source: 'deezer'
    };
    
    res.status(200).json({
      success: true,
      data: artist
    });
  } catch (error) {
    console.error('Deezer API error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Error getting artist details',
      error: error.response ? error.response.data : error.message
    });
  }
};

// @desc    Get trending tracks
// @route   GET /api/search/trending
// @access  Public
exports.getTrendingTracks = async (req, res) => {
  try {
    const response = await axios.get(`${DEEZER_API_URL}/chart/0/tracks`);
    
    // Format the response
    const tracks = response.data.data.map(track => ({
      id: `deezer_${track.id}`,
      title: track.title,
      artist: track.artist.name,
      album: track.album.title,
      duration: track.duration,
      coverImage: track.album.cover_medium || track.album.cover,
      audioSrc: track.preview,
      source: 'deezer',
      position: track.position
    }));
    
    res.status(200).json({
      success: true,
      data: tracks
    });
  } catch (error) {
    console.error('Deezer API error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Error getting trending tracks',
      error: error.response ? error.response.data : error.message
    });
  }
};

// @desc    Get tracks by genre
// @route   GET /api/search/genres/:id/tracks
// @access  Public
exports.getTracksByGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, index = 0 } = req.query;
    
    const response = await axios.get(`${DEEZER_API_URL}/genre/${id}/tracks`, {
      params: {
        limit,
        index
      }
    });
    
    // Format the response
    const tracks = response.data.data.map(track => ({
      id: `deezer_${track.id}`,
      title: track.title,
      artist: track.artist.name,
      album: track.album.title,
      duration: track.duration,
      coverImage: track.album.cover_medium || track.album.cover,
      audioSrc: track.preview,
      source: 'deezer'
    }));
    
    res.status(200).json({
      success: true,
      data: tracks,
      total: response.data.total,
      next: response.data.next ? parseInt(index) + parseInt(limit) : null
    });
  } catch (error) {
    console.error('Deezer API error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Error getting tracks by genre',
      error: error.response ? error.response.data : error.message
    });
  }
};

// @desc    Get all genres
// @route   GET /api/search/genres
// @access  Public
exports.getGenres = async (req, res) => {
  try {
    const response = await axios.get(`${DEEZER_API_URL}/genre`);
    
    // Format the response
    const genres = response.data.data.map(genre => ({
      id: genre.id,
      name: genre.name,
      picture: genre.picture_medium || genre.picture
    }));
    
    res.status(200).json({
      success: true,
      data: genres
    });
  } catch (error) {
    console.error('Deezer API error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Error getting genres',
      error: error.response ? error.response.data : error.message
    });
  }
};
