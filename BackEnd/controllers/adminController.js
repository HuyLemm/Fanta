const AccountModel = require('../models/Account');
const bcrypt = require('bcryptjs');

exports.createAdmin = async (req, res) => {
    try {
      const existingAdmin = await AccountModel.findOne({ username: 'admin' });
      if (existingAdmin) {
        console.log('Admin account already exists');
        return;
      }
  
      const hashedPassword = await bcrypt.hash('1', 10);
  
      const admin = new AccountModel({
        email: 'lthuy21@clc.fitus.edu.vn',
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
  
      await admin.save();
    } catch (error) {
      console.error('Error creating admin account:', error);
    }
  };
  