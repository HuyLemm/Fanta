const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
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
    max: 10
  }
}, {
  collection: 'ratings'
});

const ReviewModel = mongoose.model('ratings', RatingSchema);

module.exports = ReviewModel;
