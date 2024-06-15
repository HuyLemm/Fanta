const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-profile', authMiddleware.isUser, userController.getUserProfile);
router.put('/update-profile', authMiddleware.isUser, userController.updateUserProfile);
router.put('/update-password', authMiddleware.isUser, userController.updateUserPassword);


module.exports = router;
