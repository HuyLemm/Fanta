const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.post('/create-movie', adminController.createMovie);
router.post('/create-genre', adminController.createGenre)
module.exports = router;
