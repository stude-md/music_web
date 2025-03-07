const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadAvatar, uploadErrorHandler } = require('../middleware/upload.middleware');

// Protected routes
router.put('/profile', protect, uploadAvatar, uploadErrorHandler, userController.updateProfile);
router.put('/password', protect, userController.changePassword);
router.post('/favorites/:songId', protect, userController.addToFavorites);
router.delete('/favorites/:songId', protect, userController.removeFromFavorites);
router.get('/favorites', protect, userController.getFavorites);
router.get('/recently-played', protect, userController.getRecentlyPlayed);
router.post('/premium', protect, userController.upgradeToPremium);
router.get('/download-credits', protect, userController.getDownloadCredits);

module.exports = router;
