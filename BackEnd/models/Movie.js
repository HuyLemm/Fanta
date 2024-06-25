const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Episode schema for series
const EpisodeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  release_date: {
    type: Date,
    required: true
  },
  streaming_url: {
    type: String,
    required: true
  }
});

// Define Movie schema
const MovieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  release_date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  genre: {
    type: [String],
    required: true
  },
  type: {
    type: String,
    enum: ['movie', 'series'],
    required: true
  },
  director: {
    type: [String],
    required: true
  },
  cast: {
    type: [String],
    required: true
  },
  poster_url: {
    type: String,
    required: true
  },
  background_url: {
    type: String,
    required: true
  },
  trailer_url: {
    type: String,
    required: true
  },
  streaming_url: {
    type: String
  },
  episodes: [EpisodeSchema] // Optional field, only for series
}, {
  collection: 'movies'
});

// Create Movie model
const MovieModel = mongoose.model('movies', MovieSchema);

module.exports = MovieModel;
