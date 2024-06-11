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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  collection: 'accounts'
});

// Create Account model
const AccountModel = mongoose.model('accounts', AccountSchema);

module.exports = AccountModel;
