const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.post('/create-movie', authMiddleware.isAdmin, adminController.createMovie);
router.post('/create-genre', authMiddleware.isAdmin, adminController.createGenre)
router.put('/update-movie', authMiddleware.isAdmin, adminController.updateMovie)

module.exports = router;
