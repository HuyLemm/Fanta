const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.post('/create-movie', authMiddleware.isAdmin, adminController.createMovie);
router.post('/create-genre', authMiddleware.isAdmin, adminController.createGenre)
router.post('/find-movie', authMiddleware.isAdmin, adminController.findMovie);

// Get admin profile
router.get('/get-profile', authMiddleware.isAdmin, adminController.getAdminProfile);

// Update admin profile
router.put('/update-profile', authMiddleware.isAdmin, adminController.updateAdminProfile);
router.put('/update-movie', authMiddleware.isAdmin, adminController.updateMovie)
router.put('/update-password', authMiddleware.isAdmin, adminController.updateAdminPassword);

module.exports = router;
