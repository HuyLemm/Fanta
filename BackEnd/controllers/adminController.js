const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenStore = require('../utils/tokenStore');

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

    const existingGenre = await GenreModel.findOne({ name });
    if (existingGenre) {
      return res.status(400).send({ error: 'Genre already exists' });
    }

    const newGenre = new GenreModel({ name });

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

      const existingMovie = await MovieModel.findOne({ title });
      if (existingMovie) {
          return res.status(400).send({ error: 'Movie with this title already exists' });
      }

      // Chuyển đổi genre thành mảng nếu nó là một chuỗi phân tách bằng dấu phẩy
      const genresArray = typeof genre === 'string' ? genre.split(',').map(g => g.trim()) : genre;
      const directorArray = typeof director === 'string' ? director.split(',').map(g => g.trim()) : director;
      const castArray = typeof cast === 'string' ? cast.split(',').map(g => g.trim()) : cast;

      if (!Array.isArray(genresArray)) {
          return res.status(400).send({ error: 'Genres should be an array' });
      }

      // Kiểm tra tất cả các thể loại có trong genresArray không
      const existingGenres = await GenreModel.find({ name: { $in: genresArray } });

      if (existingGenres.length !== genresArray.length) {
          return res.status(400).send({ error: 'One or more genres not found' });
      }

      const newMovie = new MovieModel({
          title,
          description,
          release_date,
          duration,
          genre: genresArray,
          director: directorArray,
          cast: castArray,
          poster_url,
          trailer_url
      });

      await newMovie.save();
      res.status(201).send(newMovie);
  } catch (error) {
      res.status(400).send({ error: 'Error creating movie: ' + error.message });
  }
};




// Cập nhật một phim
exports.updateMovie = async (req, res) => {
  try {
    const { title, description, release_date, duration, genre, director, cast, poster_url, trailer_url } = req.body;

    // Tìm phim theo ID
    const existingMovie = await MovieModel.findOne({title: title})
    if (!existingMovie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    // Kiểm tra thể loại có trong genre không
    const existingGenre = await GenreModel.findOne({ name: genre });
    if (!existingGenre) {
      return res.status(400).send({ error: 'Genre not found' });
    }

    // Cập nhật thông tin phim
    existingMovie.title = title || existingMovie.title;
    existingMovie.description = description || existingMovie.description;
    existingMovie.release_date = release_date || existingMovie.release_date;
    existingMovie.duration = duration || existingMovie.duration;
    existingMovie.genre = genre || existingMovie.genre;
    existingMovie.director = director || existingMovie.director;
    existingMovie.cast = cast || existingMovie.cast;
    existingMovie.poster_url = poster_url || existingMovie.poster_url;
    existingMovie.trailer_url = trailer_url || existingMovie.trailer_url;

    await existingMovie.save();
    res.status(200).send(existingMovie);
  } catch (error) {
    res.status(400).send({ error: 'Error updating movie: ' + error.message });
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
 
