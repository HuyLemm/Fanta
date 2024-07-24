const AccountModel = require('../models/Account');
const ReviewModel = require('../models/Review');
const RatingModel = require('../models/Rating');
const HistoryModel = require('../models/History');
const WatchlistModel = require('../models/Watchlist');
const ActivityModel = require('../models/Activity');
const MovieModel = require('../models/Movie');
const logActivity = require('../utils/logActivity');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const tokenStore = require('../utils/tokenStore');

const truncateComment = (comment, maxLength = 17) => {
  if (comment.length > maxLength) {
    return comment.slice(0, maxLength) + '...';
  }
  return comment;
};



exports.createUsers = async (req, res) => {
  try {
    const userPromises = [];
    for (let i = 1; i <= 10; i++) {
      const username = `${i}`;
      const password = `${i}`;
      const email = `user${i}@example.com`;

      const existingUser = await AccountModel.findOne({ username });
      if (existingUser) {
        console.log(`User ${username} already exists`);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new AccountModel({
          email,
          username,
          password: hashedPassword,
          avatar: '',
          role: 'user',
          bannedUntil: null
        });
        userPromises.push(newUser.save());
      }
    }
    await Promise.all(userPromises);
    console.log('Users created successfully');
  } catch (error) {
    console.error('Error creating users:', error);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProfile = await AccountModel.findById(userId).select('-password');
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { email, username, avatar } = req.body;
  try {
    const userId = req.user._id;
    const updates = {};
    if (email) updates.email = email;
    if (username) updates.username = username;
    if (avatar) updates.avatar = avatar;
    updates.updatedAt = Date.now();

    const updatedProfile = await AccountModel.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    await logActivity(userId, null, 'updateProfile', `updated profile information`);

    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New password and confirm password do not match.' });
  }

  try {
    const userId = req.user._id;
    const user = await AccountModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.updatedAt = Date.now();
    await user.save();

    await logActivity(userId, null, 'updatePassword', `updated password`);

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.addReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.params;
    const { comment } = req.body;

    const user = await AccountModel.findById(userId);

    if (user.bannedUntil && new Date(user.bannedUntil) > new Date()) {
      const timeRemaining = new Date(user.bannedUntil).getTime() - new Date().getTime();
      const timeRemainingMinutes = Math.ceil(timeRemaining / (1000 * 60));
      return res.status(403).json({ message: `You are banned from adding comments for another ${timeRemainingMinutes} minutes` });
    }

    const newReview = new ReviewModel({ movie: movieId, userId, comment });
    await newReview.save();

    const populatedReview = await newReview.populate('userId', 'username avatar');

    const movie = await MovieModel.findById(movieId);
    const truncatedComment = truncateComment(comment);
    await logActivity(userId, movieId, 'addReview', `added a review "${truncatedComment}" for ${movie.title}`);

    res.json(populatedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send('Server error');
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).send('Review not found');
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).send('Forbidden');
    }

    const movie = await MovieModel.findById(review.movie);

    await ReviewModel.deleteOne({ _id: reviewId });

    await logActivity(userId, review.movie, 'deleteReview', `deleted a review for ${movie.title}`);

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).send('Server error');
  }
};

exports.updateReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;
    const { comment } = req.body;

    const user = await AccountModel.findById(userId);

    if (user.bannedUntil && new Date(user.bannedUntil) > new Date()) {
      const timeRemaining = new Date(user.bannedUntil).getTime() - new Date().getTime();
      const timeRemainingMinutes = Math.ceil(timeRemaining / (1000 * 60));
      return res.status(403).json({ message: `You are banned from editing comments for another ${timeRemainingMinutes} minutes` });
    }

    const updatedReview = await ReviewModel.findByIdAndUpdate(reviewId, { comment, updatedAt: Date.now() }, { new: true })
      .populate('userId', 'username avatar');

    if (!updatedReview) {
      return res.status(404).send('Review not found');
    }

    const movie = await MovieModel.findById(updatedReview.movie);
    const truncatedComment = truncateComment(comment);
    await logActivity(userId, updatedReview.movie, 'updateReview', `updated a review "${truncatedComment}" for ${movie.title}`);

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).send('Server error');
  }
};


exports.addOrupdateRating = async (req, res) => {
  const { rating } = req.body;
  const userId = req.user._id;
  const { movieId } = req.params;

  try {
    let userRating = await RatingModel.findOne({ userId, movieId });
    if (userRating) {
      userRating.rating = rating;
      userRating.updatedAt = Date.now();
      await userRating.save();

      const movie = await MovieModel.findById(movieId);
      await logActivity(userId, movieId, 'updateRating', `updated rating ${rating}★ for ${movie.title}`);
    } else {
      userRating = new RatingModel({ userId, movieId, rating });
      await userRating.save();

      const movie = await MovieModel.findById(movieId);
      await logActivity(userId, movieId, 'addRating', `added rating ${rating}★ for ${movie.title}`);
    }
    res.status(200).json(userRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user._id;

    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    const watchlistItem = await WatchlistModel.findOne({ user: userId, movie: movieId });

    if (watchlistItem) {
      await WatchlistModel.deleteOne({ _id: watchlistItem._id });
      const movie = await MovieModel.findById(movieId);
      await (userId, movieId,'removeFromWatchlist', `removed ${movie.title} from watchlist`);
      return res.status(200).json({ isFavourite: false, message: 'Removed from your watchlist successfully!' });
    } else {
      const newWatchlistItem = new WatchlistModel({
        user: userId,
        movie: movieId
      });

      await newWatchlistItem.save();
      const movie = await MovieModel.findById(movieId);
      await logActivity(userId, movieId, 'addToWatchlist', `added ${movie.title} to watchlist`);
      return res.status(200).json({ isFavourite: true, message: 'Added to your watchlist successfully!' });
    }
  } catch (error) {
    console.error('Toggle watchlist error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const watchlist = await WatchlistModel.find({ user: userId }).populate('movie');

    res.status(200).json(watchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).send('Server error');
  }
};

exports.removeFromFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user._id; 

    if (Array.isArray(movieId)) {
      const movies = await MovieModel.find({ _id: { $in: movieId } });
      await WatchlistModel.deleteMany({ user: userId, movie: { $in: movieId } });
      const movieTitles = movies.map(movie => movie.title).join(', ');
      await logActivity(userId, movieId, 'removeFromFavorite', `removed multiple movies from favorites: ${movieTitles}`);
    } else {
      const movie = await MovieModel.findById(movieId);
      await WatchlistModel.findOneAndDelete({ user: userId, movie: movieId });
      await logActivity(userId, movieId, 'removeFromFavorite', `removed ${movie.title} from favorites`);
    }

    res.status(200).json({ message: 'Removed from favourites successfully' });
  } catch (error) {
    console.error('Error removing from favourites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getSimilarGenreMovies = async (req, res) => {
  try {
    const { genre } = req.body;
    const userId = req.user._id;

    const watchlist = await WatchlistModel.find({ user: userId }).populate('movie');
    const similarMovies = watchlist
      .filter(item => item.movie.genre.includes(genre))
      .map(item => item.movie);

    res.status(200).json(similarMovies);
  } catch (error) {
    console.error('Error fetching similar genre movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.saveHistory = async (req, res) => {
  const { videoId, currentTime, latestEpisode } = req.body;
  const userId = req.user._id;

  try {
    const history = await HistoryModel.findOneAndUpdate(
      { userId, movieId: videoId },
      { currentTime, latestEpisode, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    const movie = await MovieModel.findById(videoId);

    // Round currentTime to the nearest second
    const roundedCurrentTime = Math.round(currentTime);

    // Convert roundedCurrentTime from seconds to HH:MM:SS format
    const hours = Math.floor(roundedCurrentTime / 3600);
    const minutes = Math.floor((roundedCurrentTime % 3600) / 60);
    const seconds = roundedCurrentTime % 60;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    await logActivity(userId, history.movieId, 'saveHistory', `saved watching history at ${formattedTime} for ${movie.title}`);
    res.status(200).json(history);
  } catch (err) {
    console.error('Failed to save history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.removeHistory = async (req, res) => {
  const { movieIds } = req.body;
  const userId = req.user._id;

  // Normalize movieIds to always be an array
  const movieIdsArray = Array.isArray(movieIds) ? movieIds : [movieIds];

  if (movieIdsArray.length === 0) {
    return res.status(400).json({ message: 'No movie IDs provided' });
  }

  try {
    const movies = await MovieModel.find({ _id: { $in: movieIdsArray } });
    await HistoryModel.deleteMany({ userId, movieId: { $in: movieIdsArray } });
    const movieTitles = movies.map(movie => movie.title).join(', ');
    await logActivity(userId, movieIds, 'removeHistory', `removed watchinghistory for movies: ${movieTitles}`);
    res.status(200).json({ message: 'Selected history deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete selected history', error });
  }
};


exports.getActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const activities = await ActivityModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username avatar');

    const formattedActivities = activities.map(activity => ({
      _id: activity._id,
      movieId: activity.movieId ? activity.movieId._id : null, // Ensure movieId is populated
      action: activity.action,
      details: activity.details,
      createdAt: activity.createdAt,
      username: activity.userId.username,
      avatar: activity.userId.avatar,
    }));

    res.status(200).json(formattedActivities);
  } catch (error) {
    console.error('Error in getActivity:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.removeActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    await ActivityModel.findByIdAndDelete(activityId);
    res.status(200).json({ message: 'Activity removed successfully' });
  } catch (error) {
    console.error('Error removing activity:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
