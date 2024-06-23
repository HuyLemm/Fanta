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

exports.getAdminProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const adminProfile = await AccountModel.findById(userId).select('-password');
    if (!adminProfile) {
        console.log('Admin profile not found');
        return res.status(404).json({ message: 'Admin profile not found' });
    }
    res.json(adminProfile);
  } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateAdminProfile = async (req, res) => {
  const { email, username } = req.body;
  try {
    const userId = req.user._id;
    const updates = {};
    if (email) updates.email = email;
    if (username) updates.username = username;

    const updatedProfile = await AccountModel.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
    ).select('-password');


    if (!updatedProfile) {
        return res.status(404).json({ message: 'Admin profile not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
      res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateAdminPassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match.' });
  }

  try {
    const userId = req.user._id;
    const admin = await AccountModel.findById(adminId);
    if (!admin) {
        return res.status(404).json({ error: 'Admin not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
      res.status(500).json({ error: 'Server error.' });
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
      const { title, description, release_date, duration, genre, director, cast, poster_url, background_url, trailer_url, streaming_url } = req.body;

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
          background_url,
          trailer_url,
          streaming_url
      });

      await newMovie.save();
      res.status(201).send(newMovie);
  } catch (error) {
      res.status(400).send({ error: 'Error creating movie: ' + error.message });
  }
};

// Tìm phim theo tiêu đề
exports.findMovie = async (req, res) => {
  try {
      const { title } = req.body;
      const movie = await MovieModel.findOne({ title });
      if (!movie) {
          return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(movie);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Cập nhật phim
exports.updateMovie = async (req, res) => {
  try {
      const { title, description, release_date, duration, genre, director, cast, poster_url, background_url, trailer_url, streaming_url } = req.body;
      const updatedMovie = await MovieModel.findOneAndUpdate(
          { title },
          { title, description, release_date, duration, genre, director, cast, poster_url, background_url, trailer_url, streaming_url },
          { new: true }
      );

      if (!updatedMovie) {
          return res.status(404).json({ error: 'Movie not found' });
      }

      res.json(updatedMovie);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
      const users = await AccountModel.find({}, 'username role');
      res.json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
      const user = await AccountModel.findById(req.params.id).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateUserById = async (req, res) => {
  const { email, username } = req.body;
  try {
      const user = await AccountModel.findByIdAndUpdate(
          req.params.id,
          { email, username },
          { new: true, runValidators: true }
      ).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
      const user = await AccountModel.findByIdAndDelete(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).send('Review not found');
    }

    await ReviewModel.deleteOne({ _id: reviewId });
    res.status(200).json({ message: 'Review deleted by admin' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).send('Server error');
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
 
