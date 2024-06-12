const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const AccountModel = require('../models/Account');
const GenreModel = require('../models/Genre');
const MovieModel = require('../models/Movie');
const ReviewModel = require('../models/Review');
const WatchlistModel = require('../models/Watchlist')
const MovieSourceModel = require('../models/MovieSource');

exports.createAdmin = async (req, res) => {
    try {
      const existingAdmin = await AccountModel.findOne({ username: 'admin' });
      if (existingAdmin) {
        console.log('Admin account already exists');
        return;
      }
  
      const hashedPassword = await bcrypt.hash('1', 10);
  
      const admin = new AccountModel({
        email: 'lthuy21@clc.fitus.edu.vn',
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
  
      await admin.save();
    } catch (error) {
      console.error('Error creating admin account:', error);
    }
  };

// Tạo một thể loại phim
exports.createGenre = async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra xem thể loại đã tồn tại chưa
    const existingGenre = await GenreModel.findOne({ name });
    if (existingGenre) {
        return res.status(400).send({ error: 'Genre already exists' });
    }

    const newGenre = new GenreModel({
        name
    });

    await newGenre.save();
    res.status(201).send(newGenre);
} catch (error) {
    res.status(400).send({ error: 'Error creating genre: ' + error.message });
}
};

// Tạo một phim
exports.createMovie = async (req, res) => {
  try {
      const { title, description, release_date, duration, genre, director, cast, poster_url, trailer_url } = req.body;

      // Kiểm tra tên phim đã tồn tại chưa
      const existingMovie = await MovieModel.findOne({ title });
      if (existingMovie) {
          return res.status(400).send({ error: 'Movie with this title already exists' });
      }

      // Kiểm tra thể loại có trong genre không
      const existingGenre = await GenreModel.findOne({ name: genre });
      if (!existingGenre) {
          return res.status(400).send({ error: 'Genre not found' });
      }

      const newMovie = new MovieModel({
          title,
          description,
          release_date,
          duration,
          genre,
          director,
          cast,
          poster_url,
          trailer_url
      });

      await newMovie.save();
      res.status(201).send(newMovie);
  } catch (error) {
      res.status(400).send({ error: 'Error creating movie: ' + error.message });
  }
};

// Tạo một đánh giá
exports.createReview = async (userId, movieId) => {

};

// Tạo danh sách xem
exports.createWatchlist = async (userId, movieId) => {
  
};

// Tạo nguồn phim
exports.createMovieSource = async (movieId) => {
 
};

// Lấy danh sách phim theo thể loại
exports.getMoviesByGenre = async (genreName) => {
  
};


exports.getMovies = async (req, res) => {
    // Logic to get movies
};
  
exports.getMovieDetails = async (req, res) => {
    // Logic to get movie details
};
  
exports.addMovieReview = async (req, res) => {
    // Logic to add movie review
};
exports.addMovieComment = async (req, res) => {
    // Logic to add movie comment
};
 
