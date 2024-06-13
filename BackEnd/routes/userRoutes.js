const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware.isUser, userController.getUserProfile);
router.put('/profile', authMiddleware.isUser, userController.updateUserProfile);
router.get('/favorites', authMiddleware.isUser, userController.getUserFavorites);
router.post('/favorites', authMiddleware.isUser, userController.addUserFavorite);

module.exports = router;
