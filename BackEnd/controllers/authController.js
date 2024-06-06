const AccountModel = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { username, password } = req.body;
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

    res.json('Log in successfully');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json('Server error');
  }
};
