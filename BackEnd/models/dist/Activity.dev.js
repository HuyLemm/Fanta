"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ActivitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'accounts',
    required: true
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'movies'
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
}, {
  collection: 'activity'
});
var ActivityModel = mongoose.model('activity', ActivitySchema);
module.exports = ActivityModel;