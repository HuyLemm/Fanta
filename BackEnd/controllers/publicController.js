const express = require('express');
const router = express.Router();
const GenreModel = require('../models/Genre');
const MovieModel = require('../models/Movie');
const ReviewModel = require('../models/Review');
const RatingModel = require('../models/Rating');
const WatchlistModel = require('../models/Watchlist');
const AccountModel = require('../models/Account');

const TMDB_API_KEY = 'd0d4e98bfef5c31d9d1e552a8d2163c3'; // Thay bằng API key của bạn

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
    const { type } = req.query;
    const matchStage = type ? { type: type } : {};

    const genres = await MovieModel.aggregate([
      { $match: matchStage }, // Apply match stage for filtering by type
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
    const { type } = req.query;
    const matchStage = type ? { 'movieDetails.type': type } : {};

    const topRatedMovies = await RatingModel.aggregate([
      {
        $group: {
          _id: "$movieId",
          averageRating: { $avg: "$rating" }
        }
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
        $match: matchStage // Apply match stage for filtering by type
      },
      {
        $sort: { averageRating: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 0,
          id: "$movieDetails._id",
          title: "$movieDetails.title",
          brief_description: "$movieDetails.brief_description",
          full_description: "$movieDetails.full_description",
          release_date: "$movieDetails.release_date",
          duration: "$movieDetails.duration",
          genre: "$movieDetails.genre",
          director: "$movieDetails.director",
          cast: "$movieDetails.cast",
          poster_url: "$movieDetails.poster_url",
          background_url: "$movieDetails.background_url",
          trailer_url: "$movieDetails.trailer_url",
          streaming_url: "$movieDetails.streaming_url",
          type: "$movieDetails.type",
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


exports.getCastAndDirectorImages = async (req, res) => {
  const { cast, director } = req.body;

  const fetchImages = async (names) => {
    const images = {};
    for (const name of names) {
      const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${name}`);
      const data = await response.json();
      if (data.results.length > 0) {
        images[name] = `https://image.tmdb.org/t/p/w500${data.results[0].profile_path}`;
      } else {
        images[name] = 'https://via.placeholder.com/150';
      }
    }
    return images;
  };

  try {
    const castImages = await fetchImages(cast);
    const directorImages = await fetchImages(director);
    res.status(200).json({ castImages, directorImages });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'An error occurred while fetching images' });
  }
};


exports.getTMDBEpisodeImages = async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (movie.type !== 'series') {
      return res.status(400).json({ message: 'Not a series' });
    }

    const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movie.title)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch TMDB data for ${movie.title}`);
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ message: 'TMDB data not found' });
    }

    const tmdbId = data.results[0].id;
    const seasonNumber = 1; // Assume all shows are season 1
    const tmdbEpisodes = [];
    
    for (let i = 0; i < movie.episodes.length; i++) {
      const episodeResponse = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}/episode/${i + 1}?api_key=${TMDB_API_KEY}`);
      
      if (!episodeResponse.ok) {
        console.error(`Failed to fetch episode ${i + 1}`);
        continue;
      }

      const contentType = episodeResponse.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const episodeData = await episodeResponse.json();
        tmdbEpisodes.push({
          ...episodeData,
          image_url: `https://image.tmdb.org/t/p/w500${episodeData.still_path}`
        });
      } else {
        console.error('Received non-JSON response for episode', i + 1);
      }
    }

    res.json(tmdbEpisodes);
  } catch (error) {
    console.error('Error fetching TMDB episodes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};