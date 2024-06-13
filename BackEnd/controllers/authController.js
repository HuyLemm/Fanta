const AccountModel = require('../models/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const tokenStore = require('../utils/tokenStore');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }

})

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const verificationCodes = {};

exports.register = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  // Kiểm tra email, username và password theo các quy tắc
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{4,19}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!emailRegex.test(email)) return res.status(400).json('Invalid email address.');

  if (!usernameRegex.test(username)) return res.status(400).json('Username must be 4-19 characters long.');

  if (!passwordRegex.test(password)) return res.status(400).json('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number');

  if (password !== confirmPassword) {
    return res.status(400).json('Passwords do not match');
  }
  console.log("I did it");
  try {
    let user = await AccountModel.findOne({ username });
    if (user) return res.status(400).json('Username already exists');

    user = await AccountModel.findOne({ email });
    if (user) return res.status(400).json('Email already exists');

     // Gửi mã xác nhận
    const verificationCode = generateVerificationCode();
    verificationCodes[email] = { code: verificationCode, expires: Date.now() + 20000 }; // 20 giây

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new AccountModel({ username, password: hashedPassword });

    transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${verificationCode}`
    }, (err, info) => {
      if (err) return res.status(500).json('Failed to send verification code');
      
      res.status(200).json('Verification code sent to your email.');
    });
    
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json('Failed to create account');
  }
};

exports.verifyCodeRegister = async (req, res) => {
  const { email, username, password, code } = req.body;

  if (!verificationCodes[email] || verificationCodes[email].code !== code || verificationCodes[email].expires < Date.now()) {
    return res.status(400).json('Invalid or expired verification code');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new AccountModel({ email, username, password: hashedPassword });

    await user.save();
    delete verificationCodes[email];

    const token = jwt.sign({_id: user._id}, process.env.SESSION_SECRET, { expiresIn: '1d' });
    tokenStore.addToken(token);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(201).json({ message: 'Account created successfully', token });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json('Failed to verify account');
  }
};

exports.resendCodeForgot = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await AccountModel.findOne({ email });
    if (!user) {
      return res.status(400).json('Email already exists');
    }

    const verificationCode = generateVerificationCode();
    verificationCodes[email] = { code: verificationCode, expires: Date.now() + 20000 }; // 20 giây

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your new email Verification Code',
      text: `Your verification code is: ${verificationCode}`
    });

    res.status(200).json('Verification code resent to your email.');
  } catch (err) {
    console.error('Resend code error:', err);
    res.status(500).json('Failed to resend code');
  }
}
exports.resendCodeRegister = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await AccountModel.findOne({ email });
    if (user) {
      return res.status(400).json('Email already exists');
    }

    const verificationCode = generateVerificationCode();
    verificationCodes[email] = { code: verificationCode, expires: Date.now() + 20000 }; // 20 giây

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your new email Verification Code',
      text: `Your verification code is: ${verificationCode}`
    });

    res.status(200).json('Verification code resent to email.');
  } catch (err) {
    console.error('Resend code error:', err);
    res.status(500).json('Failed to resend code');
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Me did it");
  try {
    const user = await AccountModel.findOne({ username });
    if (!user) {
      return res.status(404).json('Account not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json('Wrong password');
    }
     
    const token = jwt.sign({_id: user._id, role: user.role}, process.env.SESSION_SECRET, { expiresIn: '1d' });
    
    tokenStore.addToken(token);
    
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.json({ message: 'Log in successfully', token: token });
  
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json('Server error');
  }
};



exports.logout = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Kiểm tra token có trong tokenStore không
    if (tokenStore.hasToken(token)) {
      // Xóa token khỏi bộ nhớ
      tokenStore.removeToken(token);

      // Xóa cookie trên client
      res.clearCookie('jwt')
      return res.json({ message: 'Logged out successfully' });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      const user = await AccountModel.findOne({ email });
      if (!user) {
          return res.status(404).json('Email not found');
      }

      const verificationCode = generateVerificationCode();
      verificationCodes[email] = { code: verificationCode, expires: Date.now() + 20000 }; // 20 giây

      await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: 'Password Reset Verification Code',
          text: `Your verification code is: ${verificationCode}`
      });

      res.status(200).json('Verification code sent to email.');
  } catch (err) {
      res.status(500).json('Failed to send verification code');
  }
};


exports.verifyCodeForgot = async (req, res) => {
  const { email, verificationCode } = req.body;

  if (!verificationCodes[email] || verificationCodes[email].code !== verificationCode || verificationCodes[email].expires < Date.now()) {
      return res.status(400).json('Invalid or expired verification code');
  }

  res.status(200).json('Verification code verified. You can now reset your password.');
};


exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
      const user = await AccountModel.findOne({ email });
      if (!user) {
          return res.status(404).json('Account not found');
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      delete verificationCodes[email];

      res.status(200).json('Password reset successfully');
  } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json('Failed to reset password');
  }
};