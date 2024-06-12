const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getMovies);
router.get('/:id', adminController.getMovieDetails);
router.post('/:id/review', authMiddleware, adminController.addMovieReview);
router.post('/:id/comments', authMiddleware, adminController.addMovieComment);

module.exports = router;
