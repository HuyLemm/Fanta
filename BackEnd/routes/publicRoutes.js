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

router.get('/check-role', authMiddleware.authenticateToken, (req, res) => {
    res.json({ role: req.user.role });
});
  

module.exports = router;
