const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-profile', authMiddleware.isUser, userController.getUserProfile);

router.put('/update-profile', authMiddleware.isUser, userController.updateUserProfile);
router.put('/update-password', authMiddleware.isUser, userController.updateUserPassword);
router.put('/update-reviews/:reviewId', authMiddleware.authenticateToken,authMiddleware.isUser, userController.updateReview);

router.post('/add-reviews/:movieId', authMiddleware.authenticateToken,authMiddleware.isUser, userController.addReviews);
router.post('/add-and-update-rating/:movieId', authMiddleware.authenticateToken,authMiddleware.isUser, userController.addOrupdateRating);
router.post('/toggle-watchlist', authMiddleware.authenticateToken, authMiddleware.isUser, userController.toggleWatchlist);

router.delete('/delete-reviews/:reviewId', authMiddleware.authenticateToken,authMiddleware.isUser, userController.deleteReview);

module.exports = router;
