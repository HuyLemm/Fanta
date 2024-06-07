const app = require('express');
const router = app.Router();
const authController = require('../controllers/authController');
const tokenStore = require('../utils/tokenStore');

// Define routes for login and register
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/token', (req, res) => {
    res.json({ token: tokenStore.getAllTokens() });
  });

module.exports = router;

