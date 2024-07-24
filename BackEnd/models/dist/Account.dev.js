"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema; // Define Account schema

var AccountSchema = new Schema({
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
    "enum": ['user', 'admin'],
    "default": 'user'
  },
  bannedUntil: {
    type: Date,
    "default": null
  },
  updatedAt: {
    type: Date,
    "default": Date.now
  }
}, {
  collection: 'accounts'
}); // Create Account model

var AccountModel = mongoose.model('accounts', AccountSchema);
module.exports = AccountModel;