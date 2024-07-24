"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var RatingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'accounts',
    required: true
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'movies',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  updatedAt: {
    type: Date,
    "default": Date.now
  }
}, {
  collection: 'ratings'
});
var RatingModel = mongoose.model('ratings', RatingSchema);
module.exports = RatingModel;