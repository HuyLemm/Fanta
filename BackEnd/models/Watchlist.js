const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Watchlist schema
const WatchlistSchema = new Schema({
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
  added_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'watchlists'
});

// Create Watchlist model
const WatchlistModel = mongoose.model('watchlists', WatchlistSchema);

module.exports = WatchlistModel;
