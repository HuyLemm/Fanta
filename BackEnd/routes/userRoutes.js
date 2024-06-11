const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);
router.get('/favorites', authMiddleware, userController.getUserFavorites);
router.post('/favorites', authMiddleware, userController.addUserFavorite);

module.exports = router;
