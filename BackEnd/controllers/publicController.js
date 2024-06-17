const express = require('express');
const router = express.Router();
const GenreModel = require('../models/Genre');
const MovieModel = require('../models/Movie');
const ReviewModel = require('../models/Review');

exports.getAllGenres = async (req, res) => {
    try {
      const genres = await GenreModel.find({});
      res.status(200).json(genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
      res.status(500).json({ error: 'An error occurred while fetching genres' });
    }
};

exports.getGenresAndSatisfiedMovie = async (req, res) => {
  try {
    const genres = await MovieModel.aggregate([
      { $unwind: "$genre" },
      { $group: { _id: "$genre", movies: { $push: "$$ROOT" } } },
      { $project: { _id: 0, name: "$_id", movies: "$movies" } }
    ]);

    res.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await MovieModel.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'An error occurred while fetching movies' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await MovieModel.findById(req.params.id);
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ error: 'An error occurred while fetching movie' });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Tìm kiếm phim theo tiêu đề, diễn viên hoặc đạo diễn
    const movies = await MovieModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { cast: { $regex: query, $options: 'i' } },
        { director: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'An error occurred while searching for movies' });
  }
};

exports.getMoviesByGenre = async (req, res) => {
  try {
    const genre = req.query.genre;
    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    const movies = await MovieModel.find({ genre });

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    res.status(500).json({ error: 'An error occurred while fetching movies by genre' });
  }
};

exports.getRecommendedMovies = async (req, res) => {
  try {
    const { genres, currentMovieId } = req.body;
    const movies = await MovieModel.find({
      _id: { $ne: currentMovieId }, // Exclude the current movie
      genre: { $in: genres }
    });

    // Sort movies based on the number of matching genres
    const sortedMovies = movies.sort((a, b) => {
      const aMatches = a.genre.filter(genre => genres.includes(genre)).length;
      const bMatches = b.genre.filter(genre => genres.includes(genre)).length;
      return bMatches - aMatches;
    });

    res.json(sortedMovies.slice(0, 10)); // Limit to top 10 movies
  } catch (error) {
    res.status(500).send('Server Error');
  }
}

exports.getReviewsMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await ReviewModel.find({ movie: movieId }).populate('userId', 'username');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error); // Log lỗi
    res.status(500).send('Server error');
  }
}
