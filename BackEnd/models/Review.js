const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Review schema
const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'accounts',
    required: true
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'movies',
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'reviews'
});

// Create Review model
const ReviewModel = mongoose.model('reviews', ReviewSchema);

module.exports = ReviewModel;
