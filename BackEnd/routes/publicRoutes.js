const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const publicController = require('../controllers/publicController');

// GET
router.get('/get-top-rated-movies', publicController.getTopRatedMovies);
router.get('/get-genres', publicController.getAllGenres);
router.get('/get-genres-movie',publicController.getGenresAndSatisfiedMovie);
router.get('/get-movie-by-id/:id', publicController.getMovieById);
router.get('/search-movies', publicController.searchMovies);
router.get('/get-movies-by-genre', publicController.getMoviesByGenre);
router.get('/get-reviews-movie-id/:movieId', publicController.getReviewsMovieId)
router.get('/get-current-user', authMiddleware.authenticateToken, publicController.getCurrentUser);
router.get('/get-rating/:movieId', publicController.getRating)
router.get('/get-average-rating/:movieId', publicController.getAverageRatings)
router.get('/get-watchlist/:movieId', authMiddleware.authenticateToken, publicController.checkWatchlist)
router.get('/check-role', authMiddleware.authenticateToken, publicController.checkRole);
router.get('/get-tmdb-episode-images/:movieId', publicController.getTMDBEpisodeImages);
router.get('/get-history/:videoId', authMiddleware.authenticateToken,authMiddleware.checkWatchHistory, publicController.getHistory);
router.get('/get-history-for-user', authMiddleware.authenticateToken, publicController.getHistoryForUser);

// POST
router.post('/save-history', authMiddleware.authenticateToken, publicController.saveHistory);
router.post('/get-cast-and-director-images', publicController.getCastAndDirectorImages);
router.post('/get-recommended-movies', publicController.getRecommendedMovies)
router.post('/get-top-6-movies', publicController.getTop6SimilarMoviesAndTopRated)

  

module.exports = router;
