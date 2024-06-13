const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-movies', adminController.getMovies);
router.get('/get-movie-details', adminController.getMovieDetails);

router.get('/check-role', authMiddleware.authenticateToken, (req, res) => {
    res.json({ role: req.user.role });
});
  

module.exports = router;
