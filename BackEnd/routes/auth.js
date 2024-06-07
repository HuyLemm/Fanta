const app = require('express');
const router = app.Router();
const authController = require('../controllers/authController');

// Define routes for login and register
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;

