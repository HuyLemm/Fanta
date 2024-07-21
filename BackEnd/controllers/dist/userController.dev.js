"use strict";

var AccountModel = require('../models/Account');

var ReviewModel = require('../models/Review');

var RatingModel = require('../models/Rating');

var HistoryModel = require('../models/History');

var WatchlistModel = require('../models/Watchlist');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

var tokenStore = require('../utils/tokenStore');

exports.createUsers = function _callee(req, res) {
  var userPromises, i, username, password, email, existingUser, hashedPassword, newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Array to hold the user creation promises
          userPromises = []; // Loop to create 10 users

          i = 1;

        case 3:
          if (!(i <= 10)) {
            _context.next = 22;
            break;
          }

          username = "".concat(i);
          password = "".concat(i);
          email = "user".concat(i, "@example.com"); // Check if the user already exists

          _context.next = 9;
          return regeneratorRuntime.awrap(AccountModel.findOne({
            username: username
          }));

        case 9:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 14;
            break;
          }

          console.log("User ".concat(username, " already exists"));
          _context.next = 19;
          break;

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 16:
          hashedPassword = _context.sent;
          newUser = new AccountModel({
            email: email,
            username: username,
            password: hashedPassword,
            avatar: '',
            // Default avatar can be added if necessary
            role: 'user',
            bannedUntil: null
          }); // Add the save promise to the array

          userPromises.push(newUser.save());

        case 19:
          i++;
          _context.next = 3;
          break;

        case 22:
          _context.next = 24;
          return regeneratorRuntime.awrap(Promise.all(userPromises));

        case 24:
          // Send a success response
          console.log('Users created successfully');
          _context.next = 30;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.error('Error creating users:', _context.t0);

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
}; // Lấy thông tin người dùng


exports.getUserProfile = function _callee2(req, res) {
  var userId, userProfile;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.user._id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(AccountModel.findById(userId).select('-password'));

        case 4:
          userProfile = _context2.sent;

          if (userProfile) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'User profile not found'
          }));

        case 7:
          res.json(userProfile);
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching profile:', _context2.t0);
          res.status(500).json({
            message: 'Server Error'
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.updateUserProfile = function _callee3(req, res) {
  var _req$body, email, username, avatar, userId, updates, updatedProfile;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, username = _req$body.username, avatar = _req$body.avatar;
          _context3.prev = 1;
          userId = req.user._id;
          updates = {};
          if (email) updates.email = email;
          if (username) updates.username = username;
          if (avatar) updates.avatar = avatar;
          _context3.next = 9;
          return regeneratorRuntime.awrap(AccountModel.findByIdAndUpdate(userId, updates, {
            "new": true,
            runValidators: true
          }).select('-password'));

        case 9:
          updatedProfile = _context3.sent;

          if (updatedProfile) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'User profile not found'
          }));

        case 12:
          res.status(200).json({
            message: 'Profile updated successfully!'
          });
          _context3.next = 18;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: 'Server Error'
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 15]]);
};

exports.updateUserPassword = function _callee4(req, res) {
  var _req$body2, currentPassword, newPassword, confirmPassword, userId, user, isMatch, hashedPassword;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, currentPassword = _req$body2.currentPassword, newPassword = _req$body2.newPassword, confirmPassword = _req$body2.confirmPassword;

          if (!(newPassword !== confirmPassword)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'New password and confirm password do not match.'
          }));

        case 3:
          _context4.prev = 3;
          userId = req.user._id;
          _context4.next = 7;
          return regeneratorRuntime.awrap(AccountModel.findById(userId));

        case 7:
          user = _context4.sent;

          if (user) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Admin not found.'
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(bcrypt.compare(currentPassword, user.password));

        case 12:
          isMatch = _context4.sent;

          if (isMatch) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Current password is incorrect.'
          }));

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 17:
          hashedPassword = _context4.sent;
          user.password = hashedPassword;
          _context4.next = 21;
          return regeneratorRuntime.awrap(user.save());

        case 21:
          res.status(200).json({
            message: 'Password updated successfully!'
          });
          _context4.next = 27;
          break;

        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](3);
          res.status(500).json({
            error: 'Server error.'
          });

        case 27:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 24]]);
};

exports.addReviews = function _callee5(req, res) {
  var userId, movieId, comment, user, timeRemaining, timeRemainingMinutes, newReview, populatedReview;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.user._id;
          movieId = req.params.movieId;
          comment = req.body.comment;
          _context5.next = 6;
          return regeneratorRuntime.awrap(AccountModel.findById(userId));

        case 6:
          user = _context5.sent;

          if (!(user.bannedUntil && new Date(user.bannedUntil) > new Date())) {
            _context5.next = 11;
            break;
          }

          timeRemaining = new Date(user.bannedUntil).getTime() - new Date().getTime();
          timeRemainingMinutes = Math.ceil(timeRemaining / (1000 * 60)); // Tính toán số phút còn lại

          return _context5.abrupt("return", res.status(403).json({
            message: "You are banned from adding comments for another ".concat(timeRemainingMinutes, " minutes")
          }));

        case 11:
          newReview = new ReviewModel({
            movie: movieId,
            userId: userId,
            comment: comment
          });
          _context5.next = 14;
          return regeneratorRuntime.awrap(newReview.save());

        case 14:
          _context5.next = 16;
          return regeneratorRuntime.awrap(newReview.populate('userId', 'username avatar'));

        case 16:
          populatedReview = _context5.sent;
          res.json(populatedReview);
          _context5.next = 24;
          break;

        case 20:
          _context5.prev = 20;
          _context5.t0 = _context5["catch"](0);
          console.error('Error adding review:', _context5.t0); // Log lỗi chi tiết

          res.status(500).send('Server error');

        case 24:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 20]]);
}; // Xóa bình luận


exports.deleteReview = function _callee6(req, res) {
  var userId, reviewId, review;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = req.user._id;
          reviewId = req.params.reviewId;
          _context6.next = 5;
          return regeneratorRuntime.awrap(ReviewModel.findById(reviewId));

        case 5:
          review = _context6.sent;

          if (review) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(404).send('Review not found'));

        case 8:
          if (!(review.userId.toString() !== userId.toString())) {
            _context6.next = 10;
            break;
          }

          return _context6.abrupt("return", res.status(403).send('Forbidden'));

        case 10:
          _context6.next = 12;
          return regeneratorRuntime.awrap(ReviewModel.deleteOne({
            _id: reviewId
          }));

        case 12:
          res.status(200).json({
            message: 'Review deleted'
          });
          _context6.next = 19;
          break;

        case 15:
          _context6.prev = 15;
          _context6.t0 = _context6["catch"](0);
          console.error('Error deleting review:', _context6.t0);
          res.status(500).send('Server error');

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 15]]);
}; // Chỉnh sửa bình luận


exports.updateReview = function _callee7(req, res) {
  var userId, reviewId, comment, user, timeRemaining, timeRemainingMinutes, updatedReview;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          userId = req.user._id;
          reviewId = req.params.reviewId;
          comment = req.body.comment;
          _context7.next = 6;
          return regeneratorRuntime.awrap(AccountModel.findById(userId));

        case 6:
          user = _context7.sent;

          if (!(user.bannedUntil && new Date(user.bannedUntil) > new Date())) {
            _context7.next = 11;
            break;
          }

          timeRemaining = new Date(user.bannedUntil).getTime() - new Date().getTime();
          timeRemainingMinutes = Math.ceil(timeRemaining / (1000 * 60)); // Tính toán số phút còn lại

          return _context7.abrupt("return", res.status(403).json({
            message: "You are banned from editing comments for another ".concat(timeRemainingMinutes, " minutes")
          }));

        case 11:
          _context7.next = 13;
          return regeneratorRuntime.awrap(ReviewModel.findByIdAndUpdate(reviewId, {
            comment: comment
          }, {
            "new": true
          }).populate('userId', 'username avatar'));

        case 13:
          updatedReview = _context7.sent;

          if (updatedReview) {
            _context7.next = 16;
            break;
          }

          return _context7.abrupt("return", res.status(404).send('Review not found'));

        case 16:
          res.status(200).json(updatedReview);
          _context7.next = 23;
          break;

        case 19:
          _context7.prev = 19;
          _context7.t0 = _context7["catch"](0);
          console.error('Error updating review:', _context7.t0);
          res.status(500).send('Server error');

        case 23:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.addOrupdateRating = function _callee8(req, res) {
  var rating, userId, movieId, userRating;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          rating = req.body.rating;
          userId = req.user._id;
          movieId = req.params.movieId;
          _context8.prev = 3;
          _context8.next = 6;
          return regeneratorRuntime.awrap(RatingModel.findOne({
            userId: userId,
            movieId: movieId
          }));

        case 6:
          userRating = _context8.sent;

          if (!userRating) {
            _context8.next = 13;
            break;
          }

          userRating.rating = rating;
          _context8.next = 11;
          return regeneratorRuntime.awrap(userRating.save());

        case 11:
          _context8.next = 16;
          break;

        case 13:
          userRating = new RatingModel({
            userId: userId,
            movieId: movieId,
            rating: rating
          });
          _context8.next = 16;
          return regeneratorRuntime.awrap(userRating.save());

        case 16:
          res.status(200).json(userRating);
          _context8.next = 22;
          break;

        case 19:
          _context8.prev = 19;
          _context8.t0 = _context8["catch"](3);
          res.status(500).json({
            error: _context8.t0.message
          });

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 19]]);
};

exports.toggleWatchlist = function _callee9(req, res) {
  var movieId, userId, watchlistItem, newWatchlistItem;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          movieId = req.body.movieId;
          userId = req.user._id;

          if (movieId) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            message: 'Movie ID is required'
          }));

        case 5:
          _context9.next = 7;
          return regeneratorRuntime.awrap(WatchlistModel.findOne({
            user: userId,
            movie: movieId
          }));

        case 7:
          watchlistItem = _context9.sent;

          if (!watchlistItem) {
            _context9.next = 14;
            break;
          }

          _context9.next = 11;
          return regeneratorRuntime.awrap(WatchlistModel.deleteOne({
            _id: watchlistItem._id
          }));

        case 11:
          return _context9.abrupt("return", res.status(200).json({
            isFavourite: false,
            message: 'Removed from your watchlist successfully!'
          }));

        case 14:
          newWatchlistItem = new WatchlistModel({
            user: userId,
            movie: movieId
          });
          _context9.next = 17;
          return regeneratorRuntime.awrap(newWatchlistItem.save());

        case 17:
          return _context9.abrupt("return", res.status(200).json({
            isFavourite: true,
            message: 'Added to your watchlist successfully!'
          }));

        case 18:
          _context9.next = 24;
          break;

        case 20:
          _context9.prev = 20;
          _context9.t0 = _context9["catch"](0);
          console.error('Toggle watchlist error:', _context9.t0);
          res.status(500).json({
            message: 'Internal Server Error'
          });

        case 24:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

exports.getFavorite = function _callee10(req, res) {
  var userId, watchlist;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          userId = req.user._id;
          _context10.next = 4;
          return regeneratorRuntime.awrap(WatchlistModel.find({
            user: userId
          }).populate('movie'));

        case 4:
          watchlist = _context10.sent;
          res.status(200).json(watchlist);
          _context10.next = 12;
          break;

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](0);
          console.error('Error fetching watchlist:', _context10.t0);
          res.status(500).send('Server error');

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.removeFromFavorite = function _callee11(req, res) {
  var movieId, userId;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          movieId = req.body.movieId;
          userId = req.user._id;

          if (!Array.isArray(movieId)) {
            _context11.next = 8;
            break;
          }

          _context11.next = 6;
          return regeneratorRuntime.awrap(WatchlistModel.deleteMany({
            user: userId,
            movie: {
              $in: movieId
            }
          }));

        case 6:
          _context11.next = 10;
          break;

        case 8:
          _context11.next = 10;
          return regeneratorRuntime.awrap(WatchlistModel.findOneAndDelete({
            user: userId,
            movie: movieId
          }));

        case 10:
          res.status(200).json({
            message: 'Removed from favourites successfully'
          });
          _context11.next = 17;
          break;

        case 13:
          _context11.prev = 13;
          _context11.t0 = _context11["catch"](0);
          console.error('Error removing from favourites:', _context11.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 17:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.getSimilarGenreMovies = function _callee12(req, res) {
  var genre, userId, watchlist, similarMovies;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          genre = req.body.genre;
          userId = req.user._id; // Giả sử bạn có user ID từ token
          // Tìm các bộ phim trong danh sách yêu thích của người dùng có cùng thể loại

          _context12.next = 5;
          return regeneratorRuntime.awrap(WatchlistModel.find({
            user: userId
          }).populate('movie'));

        case 5:
          watchlist = _context12.sent;
          similarMovies = watchlist.filter(function (item) {
            return item.movie.genre.includes(genre);
          }).map(function (item) {
            return item.movie;
          });
          res.status(200).json(similarMovies);
          _context12.next = 14;
          break;

        case 10:
          _context12.prev = 10;
          _context12.t0 = _context12["catch"](0);
          console.error('Error fetching similar genre movies:', _context12.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 14:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.removeHistory = function _callee13(req, res) {
  var movieIds, userId;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          movieIds = req.body.movieIds;
          userId = req.user._id;

          if (!(!Array.isArray(movieIds) || movieIds.length === 0)) {
            _context13.next = 4;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            message: 'No movie IDs provided'
          }));

        case 4:
          _context13.prev = 4;
          _context13.next = 7;
          return regeneratorRuntime.awrap(HistoryModel.deleteMany({
            userId: userId,
            movieId: {
              $in: movieIds
            }
          }));

        case 7:
          res.status(200).json({
            message: 'Selected history deleted successfully'
          });
          _context13.next = 13;
          break;

        case 10:
          _context13.prev = 10;
          _context13.t0 = _context13["catch"](4);
          res.status(500).json({
            message: 'Failed to delete selected history',
            error: _context13.t0
          });

        case 13:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[4, 10]]);
};