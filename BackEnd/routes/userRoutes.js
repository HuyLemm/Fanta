const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// GET
router.get('/get-profile', authMiddleware.isUser, userController.getUserProfile);
router.get('/get-favorite', authMiddleware.isUser, userController.getFavorite);
router.get('/get-activity', authMiddleware.isUser, userController.getActivity);


// UPDATE
router.put('/update-profile', authMiddleware.isUser, userController.updateUserProfile);
router.put('/update-password', authMiddleware.isUser, userController.updateUserPassword);
router.put('/update-reviews/:reviewId', authMiddleware.isUser, userController.updateReview);

// POST
router.post('/add-reviews/:movieId', authMiddleware.isUser, userController.addReviews);
router.post('/add-and-update-rating/:movieId', authMiddleware.isUser, userController.addOrupdateRating);
router.post('/toggle-watchlist', authMiddleware.isUser, userController.toggleWatchlist);
router.post('/get-similar-genre-movies', authMiddleware.isUser, userController.getSimilarGenreMovies);
router.post('/save-history', authMiddleware.isUser, userController.saveHistory);


// DELETE
router.delete('/delete-reviews/:reviewId', authMiddleware.isUser, userController.deleteReview);
router.delete('/remove-from-favorite', authMiddleware.isUser, userController.removeFromFavorite);
router.delete('/remove-history', authMiddleware.isUser, userController.removeHistory);
router.delete('/delete-activity/:id', authMiddleware.isUser, userController.removeActivity);

module.exports = router;
