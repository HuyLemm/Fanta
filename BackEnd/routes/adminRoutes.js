const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.post('/create-movie', authMiddleware.isAdmin, adminController.createMovie);
router.post('/create-genre', authMiddleware.isAdmin, adminController.createGenre)
router.post('/find-movie', authMiddleware.isAdmin, adminController.findMovie);

// Get admin profile    
router.get('/get-profile', authMiddleware.isAdmin, adminController.getAdminProfile);
router.get('/get-users', authMiddleware.isAdmin, adminController.getUsers);
router.get('/get-user-by-id/:id', authMiddleware.isAdmin, adminController.getUserById);

// Update 
router.put('/update-profile', authMiddleware.isAdmin, adminController.updateAdminProfile);
router.put('/update-movie', authMiddleware.isAdmin, adminController.updateMovie)
router.put('/update-password', authMiddleware.isAdmin, adminController.updateAdminPassword);
router.put('/update-user-by-id/:id', authMiddleware.isAdmin, adminController.updateUserById);

// Delete
//router.delete('/delete-movie', authMiddleware.isAdmin, adminController.deleteMovie);
router.delete('/delete-user-by-id/:id', authMiddleware.isAdmin, adminController.deleteUserById);
router.delete('/delete-reviews/:reviewId', authMiddleware.isAdmin, adminController.deleteReview);

module.exports = router;
