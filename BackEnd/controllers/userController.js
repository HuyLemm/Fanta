const AccountModel = require('../models/Account');
const ReviewModel = require('../models/Review');
const RatingModel = require('../models/Rating');
const WatchlistModel = require('../models/Watchlist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const tokenStore = require('../utils/tokenStore');

// Lấy thông tin người dùng
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

      const updatedProfile = await AccountModel.findByIdAndUpdate(
          userId,
          updates,
          { new: true, runValidators: true }
      ).select('-password');


      if (!updatedProfile) {
          return res.status(404).json({ message: 'User profile not found' });
      }
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
          return res.status(404).json({ error: 'Admin not found.' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Current password is incorrect.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

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

    // Kiểm tra xem người dùng có bị cấm bình luận không
    if (user.bannedUntil && new Date(user.bannedUntil) > new Date()) {
      const timeRemaining = new Date(user.bannedUntil).getTime() - new Date().getTime();
      const timeRemainingMinutes = Math.ceil(timeRemaining / (1000 * 60)); // Tính toán số phút còn lại
      return res.status(403).json({ message: `You are banned from adding comments for another ${timeRemainingMinutes} minutes` });
    }

    const newReview = new ReviewModel({ movie: movieId, userId, comment });
    await newReview.save();

    const populatedReview = await newReview.populate('userId', 'username avatar');
    res.json(populatedReview);
  } catch (error) {
    console.error('Error adding review:', error); // Log lỗi chi tiết
    res.status(500).send('Server error');
  }
};
  
// Xóa bình luận
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).send('Review not found');
    }

    // Kiểm tra xem người dùng có phải là chủ sở hữu bình luận không
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).send('Forbidden');
    }

    await ReviewModel.deleteOne({ _id: reviewId });
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).send('Server error');
  }
};
  
// Chỉnh sửa bình luận
exports.updateReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;
    const { comment } = req.body;

    const user = await AccountModel.findById(userId);

    // Kiểm tra xem người dùng có bị cấm bình luận không
    if (user.bannedUntil && new Date(user.bannedUntil) > new Date()) {
      const timeRemaining = new Date(user.bannedUntil).getTime() - new Date().getTime();
      const timeRemainingMinutes = Math.ceil(timeRemaining / (1000 * 60)); // Tính toán số phút còn lại
      return res.status(403).json({ message: `You are banned from editing comments for another ${timeRemainingMinutes} minutes` });
    }

    const updatedReview = await ReviewModel.findByIdAndUpdate(reviewId, { comment }, { new: true })
      .populate('userId', 'username avatar'); // Populating user info

    if (!updatedReview) {
      return res.status(404).send('Review not found');
    }

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
      await userRating.save();
    } else {
      userRating = new RatingModel({ userId, movieId, rating });
      await userRating.save();
    }
    res.status(200).json(userRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.toggleWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user._id;

    const watchlistItem = await WatchlistModel.findOne({ user: userId, movie: movieId });

    if (watchlistItem) {
      await WatchlistModel.deleteOne({ _id: watchlistItem._id });
      return res.status(200).json({ isFavourite: false, message: 'Removed from your watchlist successfully!' });
    } else {
      const newWatchlistItem = new WatchlistModel({
        user: userId,
        movie: movieId
      });

      await newWatchlistItem.save();
      return res.status(200).json({ isFavourite: true, message: 'Added to your watchlist successfully!' });
    }
  } catch (error) {
    console.error('Toggle watchlist error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

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

    // Xóa bộ phim khỏi danh sách yêu thích của người dùng
    await WatchlistModel.findOneAndDelete({ user: userId, movie: movieId });

    res.status(200).json({ message: 'Removed from favourites successfully' });
  } catch (error) {
    console.error('Error removing from favourites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getSimilarGenreMovies = async (req, res) => {
  try {
    const { genre } = req.body;
    const userId = req.user._id; // Giả sử bạn có user ID từ token

    // Tìm các bộ phim trong danh sách yêu thích của người dùng có cùng thể loại
    const watchlist = await WatchlistModel.find({ user: userId }).populate('movie');
    const similarMovies = watchlist
      .filter(item => item.movie.genre.includes(genre))
      .map(item => item.movie);

    res.status(200).json(similarMovies);
  } catch (error) {
    console.error('Error fetching similar genre movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}