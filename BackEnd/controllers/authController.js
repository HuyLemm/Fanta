const AccountModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenStore = require('../utils/tokenStore');
exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra username và password theo các quy tắc
  const usernameRegex = /^[a-zA-Z0-9_]{4,19}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json('Username must be 4-19 characters long.');
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
  }

  console.log("I did it");
  try {
    let user = await AccountModel.findOne({ username });
    if (user) {
      return res.status(400).json('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new AccountModel({ username, password: hashedPassword });

    await user.save();
    res.status(201).json('Account created successfully');
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json('Failed to create account');
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
     
    const token = jwt.sign({_id: user._id}, process.env.SESSION_SECRET, { expiresIn: '1d' });
    
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
      res.clearCookie('jwt');
      return res.json({ message: 'Logged out successfully' });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};