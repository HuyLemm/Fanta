const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const publicController = require('../controllers/publicController');

router.get('/get-movies', publicController.getMovies);
router.get('/get-movie-details', adminController.getMovieDetails);
router.get('/get-genres', publicController.getAllGenres);
router.get('/get-genres-movie',publicController.getGenresAndSatisfiedMovie);
router.get('/get-movie-by-id/:id', publicController.getMovieById);
router.get('/search-movies', publicController.searchMovies);
router.get('/get-movies-by-genre', publicController.getMoviesByGenre);
router.get('/get-reviews-movie-id/:movieId', publicController.getReviewsMovieId)
router.get('/get-current-user', authMiddleware.authenticateToken, publicController.getCurrentUser);
router.get('/get-rating/:movieId', publicController.getRating)
router.get('/get-average-rating/:movieId', publicController.getAverageRatings)

router.post('/get-recommended-movies', publicController.getRecommendedMovies)


router.get('/check-role', authMiddleware.authenticateToken, (req, res) => {
    const user = {
        role: req.user.role,
        avatar: req.user.avatar
    }
    res.json(user);
});
  

module.exports = router;
