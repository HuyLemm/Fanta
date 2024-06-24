const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Account schema
const AccountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  bannedUntil: {
    type: Date,
    default: null
  }

}, {
  collection: 'accounts'
});

// Create Account model
const AccountModel = mongoose.model('accounts', AccountSchema);

module.exports = AccountModel;
