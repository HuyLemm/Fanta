const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-profile', authMiddleware.isUser, userController.getUserProfile);
router.get('/get-favorite', authMiddleware.isUser, userController.getFavorite);

router.put('/update-profile', authMiddleware.isUser, userController.updateUserProfile);
router.put('/update-password', authMiddleware.isUser, userController.updateUserPassword);
router.put('/update-reviews/:reviewId', authMiddleware.isUser, userController.updateReview);

router.post('/add-reviews/:movieId', authMiddleware.isUser, userController.addReviews);
router.post('/add-and-update-rating/:movieId', authMiddleware.isUser, userController.addOrupdateRating);
router.post('/toggle-watchlist', authMiddleware.isUser, userController.toggleWatchlist);

router.delete('/delete-reviews/:reviewId', authMiddleware.isUser, userController.deleteReview);

module.exports = router;
