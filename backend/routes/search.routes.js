const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// Public routes for searching music
router.get('/tracks', searchController.searchTracks);
router.get('/tracks/:id', searchController.getTrackDetails);
router.get('/artists', searchController.searchArtists);
router.get('/artists/:id', searchController.getArtistDetails);
router.get('/trending', searchController.getTrendingTracks);
router.get('/genres', searchController.getGenres);
router.get('/genres/:id/tracks', searchController.getTracksByGenre);

module.exports = router;
