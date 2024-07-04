const express = require('express');
const router = express.Router();
const GenreModel = require('../models/Genre');
const MovieModel = require('../models/Movie');
const ReviewModel = require('../models/Review');
const RatingModel = require('../models/Rating');
const WatchlistModel = require('../models/Watchlist');
const AccountModel = require('../models/Account');
const HistoryModel = require('../models/History');

const TMDB_API_KEY = 'd0d4e98bfef5c31d9d1e552a8d2163c3'; // Thay bằng API key của bạn

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Lấy hết thể loại
exports.getAllGenres = async (req, res) => {
    try {
      const genres = await GenreModel.find({});
      res.status(200).json(genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
      res.status(500).json({ error: 'An error occurred while fetching genres' });
    }
};

// Lấy thể loại theo type
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

// Lấy top 5 phim đánh giá cao nhất
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


// Lấy phim theo id
exports.getMovieById = async (req, res) => {
  try {
    const movie = await MovieModel.findById(req.params.id);
    if (!movie) {
      return res.status(404).send({ message: 'Movie not found' });
    }

    let streamingUrl = movie.streaming_url;
    if (movie.type === 'series' && movie.episodes && movie.episodes.length > 0) {
      streamingUrl = movie.episodes[0].streaming_url;
    }

    res.send({ ...movie._doc, streamingUrl });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Tìm kiếm phim theo tiêu đề
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

// Lấy phim theo thể loại
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

// Lấy phim gợi ý theo thể loại
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

// Lấy bình luận theo ID phim
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

// Lấy thông tin người dùng trên trang web
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

// Lấy đánh giá
exports.getRating = async (req, res) => {
  const { movieId } = req.params;

  try {
    const ratings = await RatingModel.find({ movieId }).populate('userId', 'username avatar');
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Lấy đánh giá trung bình
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

// Kiểm tra watchlist có được thêm phim hay chưa
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

// Kiểm tra role là admin hay user
exports.checkRole = async (req, res) => {
  const user = {
    role: req.user.role,
    avatar: req.user.avatar 
  }
  res.json(user);
}

// Láy hình ảnh của đạo diễn và diễn viên qua API TMDB
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

// Láy hình ảnh của tập phim qua API TMDB
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

    // Mảng các tiêu đề phim sẽ được dịch sang tiếng Việt
    const titleTranslations = {
      'The Uncanny Counter': 'Nghệ Thuật Săn Quỷ Và Nấu Mì',
      // Thêm các cặp tiêu đề khác vào đây
    };

    // Function to fetch TMDB data for a given title
    const fetchTMDBData = async (title) => {
      const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch TMDB data for ${title}`);
      }
      return response.json();
    };

    // Tìm kiếm tiêu đề phim bằng tiếng Việt nếu có, nếu không thì dùng tiếng Anh
    const searchTitle = titleTranslations[movie.title] || movie.title;

    const data = await fetchTMDBData(searchTitle);
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

// controllers/publicController.js
exports.saveHistory = async (req, res) => {
  const { videoId, currentTime, latestEpisode } = req.body;
  const userId = req.user._id;

  try {
    const history = await HistoryModel.findOneAndUpdate(
      { userId, movieId: videoId },
      { currentTime, latestEpisode, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.status(200).json(history);
  } catch (err) {
    console.error('Failed to save history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/publicController.js
exports.getHistory = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  try {
    const history = await HistoryModel.findOne({ userId, movieId: videoId });
    if (!history) {
      return res.status(404).json({ error: 'History not found' });
    }
    res.status(200).json(history);
  } catch (err) {
    console.error('Failed to fetch history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getHistoryForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await HistoryModel.find({ userId }).sort({ updatedAt: -1 }).exec();
    const movieIds = history.map(h => h.movieId);
    const movies = await MovieModel.find({ _id: { $in: movieIds } }).exec();
    
    const historyWithMovies = history.map(h => {
      const movie = movies.find(m => m._id.toString() === h.movieId.toString());
      let duration = movie.duration;

      if (movie.type === 'series' && h.latestEpisode !== undefined) {
        const episode = movie.episodes[h.latestEpisode - 1]; // Assuming episodeNumber is 1-based index
        if (episode) {
          duration = episode.duration;
        } else {
          console.log(`Episode ${h.latestEpisode} not found for series ${movie.title}`);
        }
      }

      return { 
        ...h._doc,
        movie: {
          ...movie._doc,
          duration,
        }
      };
    });

    res.status(200).json(historyWithMovies);
  } catch (error) {
    console.error('Failed to fetch history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

exports.getTop6SimilarMoviesAndTopRated = async (req, res) => {
  try {
    const { genres, currentMovieId } = req.body; // Lấy danh sách thể loại và ID phim hiện tại từ yêu cầu

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      return res.status(400).json({ message: 'Genres are required and must be an array.' });
    }

    if (!currentMovieId) {
      return res.status(400).json({ message: 'Current movie ID is required.' });
    }

    // Tìm các bộ phim có nhiều thể loại giống nhau nhất
    let movies = await MovieModel.find({
      _id: { $ne: currentMovieId }, // Loại trừ phim hiện tại
      genre: { $in: genres }
    });

    // Tính toán số lượng thể loại khớp và rating trung bình cho mỗi phim
    movies = await Promise.all(
      movies.map(async (movie) => {
        const matchedGenres = movie.genre.filter((genre) => genres.includes(genre)).length;
        const ratings = await RatingModel.find({ movieId: movie._id });
        const averageRating = ratings.length
          ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
          : 0;
        return { ...movie._doc, matchedGenres, averageRating };
      })
    );

    // Sắp xếp các phim dựa trên số lượng thể loại khớp và rating trung bình
    movies.sort((a, b) => {
      if (b.matchedGenres !== a.matchedGenres) {
        return b.matchedGenres - a.matchedGenres;
      }
      return b.averageRating - a.averageRating;
    });

    console.log('Recommended Movies:', movies.slice(0, 6));

    res.json(movies.slice(0, 8)); // Giới hạn kết quả đến 6 phim
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    res.status(500).send('Server Error');
  }
}