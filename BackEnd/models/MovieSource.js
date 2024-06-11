const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define MovieSource schema
const MovieSourceSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'movies',
    required: true
  },
  source_url: {
    type: String,
    required: true
  },
  quality: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  }
}, {
  collection: 'movie_sources'
});

// Create MovieSource model
const MovieSourceModel = mongoose.model('movie_sources', MovieSourceSchema);

module.exports = MovieSourceModel;
