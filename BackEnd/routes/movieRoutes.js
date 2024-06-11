const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieDetails);
router.post('/:id/review', authMiddleware, movieController.addMovieReview);
router.post('/:id/comments', authMiddleware, movieController.addMovieComment);

module.exports = router;
