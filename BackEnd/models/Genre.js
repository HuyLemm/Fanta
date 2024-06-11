const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Genre schema
const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  collection: 'genres'
});

// Create Genre model
const GenreModel = mongoose.model('genres', GenreSchema);

module.exports = GenreModel;
