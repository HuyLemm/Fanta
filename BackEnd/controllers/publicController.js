const express = require('express');
const router = express.Router();
const GenreModel = require('../models/Genre');
const MovieModel = require('../models/Movie');
const ReviewModel = require('../models/Review');
const RatingModel = require('../models/Rating');
const WatchlistModel = require('../models/Watchlist');
const AccountModel = require('../models/Account');

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

exports.getTopRatedMovies = async (req, res) => {
  try {
    const topRatedMovies = await RatingModel.aggregate([
      {
        $group: {
          _id: "$movieId",
          averageRating: { $avg: "$rating" }
        }
      },
      {
        $sort: { averageRating: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movieDetails"
        }
      },
      {
        $unwind: "$movieDetails"
      },
      {
        $project: {
          _id: "$movieDetails._id",
          title: "$movieDetails.title",
          description: "$movieDetails.description",
          release_date: "$movieDetails.release_date",
          duration: "$movieDetails.duration",
          genre: "$movieDetails.genre",
          director: "$movieDetails.director",
          cast: "$movieDetails.cast",
          poster_url: "$movieDetails.poster_url",
          background_url: "$movieDetails.background_url",
          trailer_url: "$movieDetails.trailer_url",
          streaming_url: "$movieDetails.streaming_url",
          averageRating: 1
        }
      }
    ]);

    res.status(200).json(topRatedMovies);
  } catch (error) {
    console.error('Error fetching top-rated movies:', error);
    res.status(500).json({ error: 'An error occurred while fetching top-rated movies' });
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
    const reviews = await ReviewModel.find({ movie: movieId }).populate('userId', 'username avatar');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error); // Log lỗi
    res.status(500).send('Server error');
  }
}

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await AccountModel.findById(userId).select('username avatar role');

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).send('Server error');
  }
};

exports.getRating = async (req, res) => {
  const { movieId } = req.params;

  try {
    const ratings = await RatingModel.find({ movieId }).populate('userId', 'username avatar');
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getAverageRatings =   async (req, res) => { 
  const { movieId } = req.params;

  try {
    const ratings = await RatingModel.find({ movieId });
    if (ratings.length === 0) {
      return res.status(200).json({ averageRating: 0, numberOfRatings: 0 });
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    res.status(200).json({ averageRating, numberOfRatings: ratings.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.checkWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const watchlistItem = await WatchlistModel.findOne({ user: userId, movie: movieId });

    if (watchlistItem) {
      return res.status(200).json({ isFavourite: true });
    } else {
      return res.status(200).json({ isFavourite: false });
    }
  } catch (error) {
    console.error('Check watchlist error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.checkRole = async (req, res) => {
  const user = {
    role: req.user.role,
    avatar: req.user.avatar 
  }
  res.json(user);
}