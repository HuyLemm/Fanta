"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema; // Define Review schema

var ReviewSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'movies',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'accounts',
    required: true
  },
  comment: {
    type: String
  },
  updatedAt: {
    type: Date,
    "default": Date.now
  }
}, {
  collection: 'reviews'
}); // Create Review model

var ReviewModel = mongoose.model('reviews', ReviewSchema);
module.exports = ReviewModel;