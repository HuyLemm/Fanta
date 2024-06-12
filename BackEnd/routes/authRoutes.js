const app = require('express');
const router = app.Router();
const authController = require('../controllers/authController');
const tokenStore = require('../utils/tokenStore');

// Define routes for login and register
//POST
router.post('/register', authController.register);
router.post('/verify-register', authController.verifyCodeRegister);
router.post('/resend-register', authController.resendCodeRegister);
router.post('/resend-forgot', authController.resendCodeForgot);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword); //yêu cầu mã xác thực
router.post('/verify-forgot', authController.verifyCodeForgot);

//PUT
router.put('/reset-password', authController.resetPassword);


//GET
router.get('/token', (req, res) => {
    res.json({ token: tokenStore.getAllTokens() });
  });

module.exports = router;

