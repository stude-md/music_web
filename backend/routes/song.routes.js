const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { uploadSong, uploadErrorHandler } = require('../middleware/upload.middleware');

// Public routes
router.get('/', songController.getAllSongs);
router.get('/:id', songController.getSongById);

// Protected routes
router.post('/', protect, uploadSong, uploadErrorHandler, songController.uploadSong);
router.put('/:id', protect, uploadSong, uploadErrorHandler, songController.updateSong);
router.delete('/:id', protect, songController.deleteSong);
router.get('/:id/download', protect, songController.downloadSong);

module.exports = router;
