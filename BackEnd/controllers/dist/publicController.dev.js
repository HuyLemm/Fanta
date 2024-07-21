"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var express = require('express');

var router = express.Router();

var GenreModel = require('../models/Genre');

var MovieModel = require('../models/Movie');

var ReviewModel = require('../models/Review');

var RatingModel = require('../models/Rating');

var WatchlistModel = require('../models/Watchlist');

var AccountModel = require('../models/Account');

var HistoryModel = require('../models/History');

var TMDB_API_KEY = 'd0d4e98bfef5c31d9d1e552a8d2163c3'; // Thay bằng API key của bạn

var fetch = function fetch() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('node-fetch'));
  }).then(function (_ref) {
    var fetch = _ref["default"];
    return fetch.apply(void 0, args);
  });
}; // Lấy hết thể loại


exports.getAllGenres = function _callee(req, res) {
  var genres;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(GenreModel.find({}));

        case 3:
          genres = _context.sent;
          res.status(200).json(genres);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching genres:', _context.t0);
          res.status(500).json({
            error: 'An error occurred while fetching genres'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Lấy thể loại theo type


exports.getGenresAndSatisfiedMovie = function _callee2(req, res) {
  var type, matchStage, genres;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          type = req.query.type;
          matchStage = type ? {
            type: type
          } : {};
          _context2.next = 5;
          return regeneratorRuntime.awrap(MovieModel.aggregate([{
            $match: matchStage
          }, // Apply match stage for filtering by type
          {
            $unwind: "$genre"
          }, {
            $group: {
              _id: "$genre",
              movies: {
                $push: "$$ROOT"
              }
            }
          }, {
            $project: {
              _id: 0,
              name: "$_id",
              movies: "$movies"
            }
          }, {
            $sort: {
              name: 1
            }
          } // Sort genres alphabetically
          ]));

        case 5:
          genres = _context2.sent;
          res.json(genres);
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching genres:', _context2.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Lấy top 5 phim đánh giá cao nhất


exports.getTopRatedMovies = function _callee3(req, res) {
  var type, matchStage, topRatedMovies;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          type = req.query.type;
          matchStage = type ? {
            'movieDetails.type': type
          } : {};
          _context3.next = 5;
          return regeneratorRuntime.awrap(RatingModel.aggregate([{
            $group: {
              _id: "$movieId",
              averageRating: {
                $avg: "$rating"
              }
            }
          }, {
            $lookup: {
              from: "movies",
              localField: "_id",
              foreignField: "_id",
              as: "movieDetails"
            }
          }, {
            $unwind: "$movieDetails"
          }, {
            $match: matchStage // Apply match stage for filtering by type

          }, {
            $sort: {
              averageRating: -1
            }
          }, {
            $limit: 5
          }, {
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
          }]));

        case 5:
          topRatedMovies = _context3.sent;
          res.status(200).json(topRatedMovies);
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error('Error fetching top-rated movies:', _context3.t0);
          res.status(500).json({
            error: 'An error occurred while fetching top-rated movies'
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Lấy phim theo id


exports.getMovieById = function _callee4(req, res) {
  var movie, streamingUrl;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(MovieModel.findById(req.params.id));

        case 3:
          movie = _context4.sent;

          if (movie) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).send({
            message: 'Movie not found'
          }));

        case 6:
          streamingUrl = movie.streaming_url;

          if (movie.type === 'series' && movie.episodes && movie.episodes.length > 0) {
            streamingUrl = movie.episodes[0].streaming_url;
          }

          res.send(_objectSpread({}, movie._doc, {
            streamingUrl: streamingUrl
          }));
          _context4.next = 14;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          res.status(500).send({
            message: _context4.t0.message
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // Tìm kiếm phim theo tiêu đề


exports.searchMovies = function _callee5(req, res) {
  var query, movies;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          query = req.query.query;

          if (query) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Query is required'
          }));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(MovieModel.find({
            $or: [{
              title: {
                $regex: query,
                $options: 'i'
              }
            }, {
              cast: {
                $regex: query,
                $options: 'i'
              }
            }, {
              director: {
                $regex: query,
                $options: 'i'
              }
            }]
          }));

        case 6:
          movies = _context5.sent;
          res.json(movies);
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.error('Error searching movies:', _context5.t0);
          res.status(500).json({
            error: 'An error occurred while searching for movies'
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Lấy phim theo thể loại


exports.getMoviesByGenre = function _callee6(req, res) {
  var genre, movies;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          genre = req.query.genre;

          if (genre) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'Genre is required'
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(MovieModel.find({
            genre: genre
          }));

        case 6:
          movies = _context6.sent;
          res.json(movies);
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error('Error fetching movies by genre:', _context6.t0);
          res.status(500).json({
            error: 'An error occurred while fetching movies by genre'
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Lấy phim gợi ý theo thể loại


exports.getRecommendedMovies = function _callee7(req, res) {
  var _req$body, genres, currentMovieId, movies, sortedMovies;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$body = req.body, genres = _req$body.genres, currentMovieId = _req$body.currentMovieId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(MovieModel.find({
            _id: {
              $ne: currentMovieId
            },
            // Exclude the current movie
            genre: {
              $in: genres
            }
          }));

        case 4:
          movies = _context7.sent;
          // Sort movies based on the number of matching genres
          sortedMovies = movies.sort(function (a, b) {
            var aMatches = a.genre.filter(function (genre) {
              return genres.includes(genre);
            }).length;
            var bMatches = b.genre.filter(function (genre) {
              return genres.includes(genre);
            }).length;
            return bMatches - aMatches;
          });
          res.json(sortedMovies.slice(0, 10)); // Limit to top 10 movies

          _context7.next = 12;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          res.status(500).send('Server Error');

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Lấy bình luận theo ID phim


exports.getReviewsMovieId = function _callee8(req, res) {
  var movieId, reviews;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          movieId = req.params.movieId;
          _context8.next = 4;
          return regeneratorRuntime.awrap(ReviewModel.find({
            movie: movieId
          }).populate('userId', 'username avatar'));

        case 4:
          reviews = _context8.sent;
          res.json(reviews);
          _context8.next = 12;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          console.error('Error fetching reviews:', _context8.t0); // Log lỗi

          res.status(500).send('Server error');

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // Lấy thông tin người dùng trên trang web


exports.getCurrentUser = function _callee9(req, res) {
  var userId, user;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userId = req.user._id;
          _context9.next = 4;
          return regeneratorRuntime.awrap(AccountModel.findById(userId).select('username avatar role'));

        case 4:
          user = _context9.sent;

          if (user) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).send('User not found'));

        case 7:
          res.status(200).json(user);
          _context9.next = 14;
          break;

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.error('Error fetching current user:', _context9.t0);
          res.status(500).send('Server error');

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Lấy đánh giá


exports.getRating = function _callee10(req, res) {
  var movieId, ratings;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          movieId = req.params.movieId;
          _context10.prev = 1;
          _context10.next = 4;
          return regeneratorRuntime.awrap(RatingModel.find({
            movieId: movieId
          }).populate('userId', 'username avatar'));

        case 4:
          ratings = _context10.sent;
          res.status(200).json(ratings);
          _context10.next = 11;
          break;

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](1);
          res.status(500).json({
            error: _context10.t0.message
          });

        case 11:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.getRatingHover = function _callee11(req, res) {
  var userId, movieId, rating;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          userId = req.user._id;
          movieId = req.params.movieId;
          _context11.next = 5;
          return regeneratorRuntime.awrap(RatingModel.findOne({
            userId: userId,
            movieId: movieId
          }));

        case 5:
          rating = _context11.sent;

          if (!rating) {
            _context11.next = 10;
            break;
          }

          return _context11.abrupt("return", res.json(rating));

        case 10:
          return _context11.abrupt("return", res.json(null));

        case 11:
          _context11.next = 16;
          break;

        case 13:
          _context11.prev = 13;
          _context11.t0 = _context11["catch"](0);
          res.status(500).json({
            error: _context11.t0.message
          });

        case 16:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // Lấy đánh giá trung bình


exports.getAverageRatings = function _callee12(req, res) {
  var movieId, ratings, totalRating, averageRating;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          movieId = req.params.movieId;
          _context12.prev = 1;
          _context12.next = 4;
          return regeneratorRuntime.awrap(RatingModel.find({
            movieId: movieId
          }));

        case 4:
          ratings = _context12.sent;

          if (!(ratings.length === 0)) {
            _context12.next = 7;
            break;
          }

          return _context12.abrupt("return", res.status(200).json({
            averageRating: 0,
            numberOfRatings: 0
          }));

        case 7:
          totalRating = ratings.reduce(function (sum, rating) {
            return sum + rating.rating;
          }, 0);
          averageRating = totalRating / ratings.length;
          res.status(200).json({
            averageRating: averageRating,
            numberOfRatings: ratings.length
          });
          _context12.next = 15;
          break;

        case 12:
          _context12.prev = 12;
          _context12.t0 = _context12["catch"](1);
          res.status(500).json({
            error: _context12.t0.message
          });

        case 15:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[1, 12]]);
}; // Kiểm tra watchlist có được thêm phim hay chưa


exports.checkWatchlist = function _callee13(req, res) {
  var movieId, userId, watchlistItem;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          movieId = req.params.movieId;
          userId = req.user._id;
          _context13.next = 5;
          return regeneratorRuntime.awrap(WatchlistModel.findOne({
            user: userId,
            movie: movieId
          }));

        case 5:
          watchlistItem = _context13.sent;

          if (!watchlistItem) {
            _context13.next = 10;
            break;
          }

          return _context13.abrupt("return", res.status(200).json({
            isFavourite: true
          }));

        case 10:
          return _context13.abrupt("return", res.status(200).json({
            isFavourite: false
          }));

        case 11:
          _context13.next = 17;
          break;

        case 13:
          _context13.prev = 13;
          _context13.t0 = _context13["catch"](0);
          console.error('Check watchlist error:', _context13.t0);
          res.status(500).json({
            message: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // Kiểm tra role là admin hay user


exports.checkRole = function _callee14(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          user = {
            role: req.user.role,
            avatar: req.user.avatar
          };
          res.json(user);

        case 2:
        case "end":
          return _context14.stop();
      }
    }
  });
}; // Láy hình ảnh của đạo diễn và diễn viên qua API TMDB


exports.getCastAndDirectorImages = function _callee15(req, res) {
  var _req$body2, cast, director, fetchImages, castImages, directorImages;

  return regeneratorRuntime.async(function _callee15$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _req$body2 = req.body, cast = _req$body2.cast, director = _req$body2.director;

          fetchImages = function fetchImages(names) {
            var images, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, response, data;

            return regeneratorRuntime.async(function fetchImages$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    images = {};
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context15.prev = 4;
                    _iterator = names[Symbol.iterator]();

                  case 6:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context15.next = 18;
                      break;
                    }

                    name = _step.value;
                    _context15.next = 10;
                    return regeneratorRuntime.awrap(fetch("https://api.themoviedb.org/3/search/person?api_key=".concat(TMDB_API_KEY, "&query=").concat(name)));

                  case 10:
                    response = _context15.sent;
                    _context15.next = 13;
                    return regeneratorRuntime.awrap(response.json());

                  case 13:
                    data = _context15.sent;

                    if (data.results.length > 0) {
                      images[name] = "https://image.tmdb.org/t/p/w500".concat(data.results[0].profile_path);
                    } else {
                      images[name] = 'https://via.placeholder.com/150';
                    }

                  case 15:
                    _iteratorNormalCompletion = true;
                    _context15.next = 6;
                    break;

                  case 18:
                    _context15.next = 24;
                    break;

                  case 20:
                    _context15.prev = 20;
                    _context15.t0 = _context15["catch"](4);
                    _didIteratorError = true;
                    _iteratorError = _context15.t0;

                  case 24:
                    _context15.prev = 24;
                    _context15.prev = 25;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 27:
                    _context15.prev = 27;

                    if (!_didIteratorError) {
                      _context15.next = 30;
                      break;
                    }

                    throw _iteratorError;

                  case 30:
                    return _context15.finish(27);

                  case 31:
                    return _context15.finish(24);

                  case 32:
                    return _context15.abrupt("return", images);

                  case 33:
                  case "end":
                    return _context15.stop();
                }
              }
            }, null, null, [[4, 20, 24, 32], [25,, 27, 31]]);
          };

          _context16.prev = 2;
          _context16.next = 5;
          return regeneratorRuntime.awrap(fetchImages(cast));

        case 5:
          castImages = _context16.sent;
          _context16.next = 8;
          return regeneratorRuntime.awrap(fetchImages(director));

        case 8:
          directorImages = _context16.sent;
          res.status(200).json({
            castImages: castImages,
            directorImages: directorImages
          });
          _context16.next = 16;
          break;

        case 12:
          _context16.prev = 12;
          _context16.t0 = _context16["catch"](2);
          console.error('Error fetching images:', _context16.t0);
          res.status(500).json({
            error: 'An error occurred while fetching images'
          });

        case 16:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[2, 12]]);
}; // Láy hình ảnh của tập phim qua API TMDB


exports.getTMDBEpisodeImages = function _callee16(req, res) {
  var movieId, movie, titleTranslations, fetchTMDBData, searchTitle, data, tmdbId, seasonNumber, tmdbEpisodes, i, episodeResponse, contentType, episodeData;
  return regeneratorRuntime.async(function _callee16$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          movieId = req.params.movieId;
          _context18.prev = 1;
          _context18.next = 4;
          return regeneratorRuntime.awrap(MovieModel.findById(movieId));

        case 4:
          movie = _context18.sent;

          if (movie) {
            _context18.next = 7;
            break;
          }

          return _context18.abrupt("return", res.status(404).json({
            message: 'Movie not found'
          }));

        case 7:
          if (!(movie.type !== 'series')) {
            _context18.next = 9;
            break;
          }

          return _context18.abrupt("return", res.status(400).json({
            message: 'Not a series'
          }));

        case 9:
          // Mảng các tiêu đề phim sẽ được dịch sang tiếng Việt
          titleTranslations = {
            'The Uncanny Counter': 'Nghệ Thuật Săn Quỷ Và Nấu Mì' // Thêm các cặp tiêu đề khác vào đây

          }; // Function to fetch TMDB data for a given title

          fetchTMDBData = function fetchTMDBData(title) {
            var response;
            return regeneratorRuntime.async(function fetchTMDBData$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    _context17.next = 2;
                    return regeneratorRuntime.awrap(fetch("https://api.themoviedb.org/3/search/tv?api_key=".concat(TMDB_API_KEY, "&query=").concat(encodeURIComponent(title))));

                  case 2:
                    response = _context17.sent;

                    if (response.ok) {
                      _context17.next = 5;
                      break;
                    }

                    throw new Error("Failed to fetch TMDB data for ".concat(title));

                  case 5:
                    return _context17.abrupt("return", response.json());

                  case 6:
                  case "end":
                    return _context17.stop();
                }
              }
            });
          }; // Tìm kiếm tiêu đề phim bằng tiếng Việt nếu có, nếu không thì dùng tiếng Anh


          searchTitle = titleTranslations[movie.title] || movie.title;
          _context18.next = 14;
          return regeneratorRuntime.awrap(fetchTMDBData(searchTitle));

        case 14:
          data = _context18.sent;

          if (!(!data.results || data.results.length === 0)) {
            _context18.next = 17;
            break;
          }

          return _context18.abrupt("return", res.status(404).json({
            message: 'TMDB data not found'
          }));

        case 17:
          tmdbId = data.results[0].id;
          seasonNumber = 1; // Assume all shows are season 1

          tmdbEpisodes = [];
          i = 0;

        case 21:
          if (!(i < movie.episodes.length)) {
            _context18.next = 40;
            break;
          }

          _context18.next = 24;
          return regeneratorRuntime.awrap(fetch("https://api.themoviedb.org/3/tv/".concat(tmdbId, "/season/").concat(seasonNumber, "/episode/").concat(i + 1, "?api_key=").concat(TMDB_API_KEY)));

        case 24:
          episodeResponse = _context18.sent;

          if (episodeResponse.ok) {
            _context18.next = 28;
            break;
          }

          console.error("Failed to fetch episode ".concat(i + 1));
          return _context18.abrupt("continue", 37);

        case 28:
          contentType = episodeResponse.headers.get('content-type');

          if (!(contentType && contentType.indexOf('application/json') !== -1)) {
            _context18.next = 36;
            break;
          }

          _context18.next = 32;
          return regeneratorRuntime.awrap(episodeResponse.json());

        case 32:
          episodeData = _context18.sent;
          tmdbEpisodes.push(_objectSpread({}, episodeData, {
            image_url: "https://image.tmdb.org/t/p/w500".concat(episodeData.still_path)
          }));
          _context18.next = 37;
          break;

        case 36:
          console.error('Received non-JSON response for episode', i + 1);

        case 37:
          i++;
          _context18.next = 21;
          break;

        case 40:
          res.json(tmdbEpisodes);
          _context18.next = 47;
          break;

        case 43:
          _context18.prev = 43;
          _context18.t0 = _context18["catch"](1);
          console.error('Error fetching TMDB episodes:', _context18.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 47:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[1, 43]]);
}; // controllers/publicController.js


exports.saveHistory = function _callee17(req, res) {
  var _req$body3, videoId, currentTime, latestEpisode, userId, history;

  return regeneratorRuntime.async(function _callee17$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _req$body3 = req.body, videoId = _req$body3.videoId, currentTime = _req$body3.currentTime, latestEpisode = _req$body3.latestEpisode;
          userId = req.user._id;
          _context19.prev = 2;
          _context19.next = 5;
          return regeneratorRuntime.awrap(HistoryModel.findOneAndUpdate({
            userId: userId,
            movieId: videoId
          }, {
            currentTime: currentTime,
            latestEpisode: latestEpisode,
            updatedAt: Date.now()
          }, {
            upsert: true,
            "new": true
          }));

        case 5:
          history = _context19.sent;
          res.status(200).json(history);
          _context19.next = 13;
          break;

        case 9:
          _context19.prev = 9;
          _context19.t0 = _context19["catch"](2);
          console.error('Failed to save history:', _context19.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 13:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; // controllers/publicController.js


exports.getHistory = function _callee18(req, res) {
  var videoId, userId, history;
  return regeneratorRuntime.async(function _callee18$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          videoId = req.params.videoId;
          userId = req.user._id;
          _context20.prev = 2;
          _context20.next = 5;
          return regeneratorRuntime.awrap(HistoryModel.findOne({
            userId: userId,
            movieId: videoId
          }));

        case 5:
          history = _context20.sent;

          if (history) {
            _context20.next = 8;
            break;
          }

          return _context20.abrupt("return", res.status(404).json({
            error: 'History not found'
          }));

        case 8:
          res.status(200).json(history);
          _context20.next = 15;
          break;

        case 11:
          _context20.prev = 11;
          _context20.t0 = _context20["catch"](2);
          console.error('Failed to fetch history:', _context20.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 15:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[2, 11]]);
};

exports.getHistoryForUser = function _callee19(req, res) {
  var userId, history, movieIds, movies, historyWithMovies;
  return regeneratorRuntime.async(function _callee19$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          userId = req.user._id;
          _context21.next = 4;
          return regeneratorRuntime.awrap(HistoryModel.find({
            userId: userId
          }).sort({
            updatedAt: -1
          }).exec());

        case 4:
          history = _context21.sent;
          movieIds = history.map(function (h) {
            return h.movieId;
          });
          _context21.next = 8;
          return regeneratorRuntime.awrap(MovieModel.find({
            _id: {
              $in: movieIds
            }
          }).exec());

        case 8:
          movies = _context21.sent;
          historyWithMovies = history.map(function (h) {
            var movie = movies.find(function (m) {
              return m._id.toString() === h.movieId.toString();
            });
            var duration = movie.duration;

            if (movie.type === 'series' && h.latestEpisode !== undefined) {
              var episode = movie.episodes[h.latestEpisode - 1]; // Assuming episodeNumber is 1-based index

              if (episode) {
                duration = episode.duration;
              } else {
                console.log("Episode ".concat(h.latestEpisode, " not found for series ").concat(movie.title));
              }
            }

            return _objectSpread({}, h._doc, {
              movie: _objectSpread({}, movie._doc, {
                duration: duration
              })
            });
          });
          res.status(200).json(historyWithMovies);
          _context21.next = 17;
          break;

        case 13:
          _context21.prev = 13;
          _context21.t0 = _context21["catch"](0);
          console.error('Failed to fetch history:', _context21.t0);
          res.status(500).json({
            error: 'Failed to fetch history'
          });

        case 17:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.getTop6SimilarMoviesAndTopRated = function _callee21(req, res) {
  var _req$body4, genres, currentMovieId, movies;

  return regeneratorRuntime.async(function _callee21$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          _req$body4 = req.body, genres = _req$body4.genres, currentMovieId = _req$body4.currentMovieId; // Lấy danh sách thể loại và ID phim hiện tại từ yêu cầu

          if (!(!genres || !Array.isArray(genres) || genres.length === 0)) {
            _context23.next = 4;
            break;
          }

          return _context23.abrupt("return", res.status(400).json({
            message: 'Genres are required and must be an array.'
          }));

        case 4:
          if (currentMovieId) {
            _context23.next = 6;
            break;
          }

          return _context23.abrupt("return", res.status(400).json({
            message: 'Current movie ID is required.'
          }));

        case 6:
          _context23.next = 8;
          return regeneratorRuntime.awrap(MovieModel.find({
            _id: {
              $ne: currentMovieId
            },
            // Loại trừ phim hiện tại
            genre: {
              $in: genres
            }
          }));

        case 8:
          movies = _context23.sent;
          _context23.next = 11;
          return regeneratorRuntime.awrap(Promise.all(movies.map(function _callee20(movie) {
            var matchedGenres, ratings, averageRating;
            return regeneratorRuntime.async(function _callee20$(_context22) {
              while (1) {
                switch (_context22.prev = _context22.next) {
                  case 0:
                    matchedGenres = movie.genre.filter(function (genre) {
                      return genres.includes(genre);
                    }).length;
                    _context22.next = 3;
                    return regeneratorRuntime.awrap(RatingModel.find({
                      movieId: movie._id
                    }));

                  case 3:
                    ratings = _context22.sent;
                    averageRating = ratings.length ? ratings.reduce(function (acc, rating) {
                      return acc + rating.rating;
                    }, 0) / ratings.length : 0;
                    return _context22.abrupt("return", _objectSpread({}, movie._doc, {
                      matchedGenres: matchedGenres,
                      averageRating: averageRating
                    }));

                  case 6:
                  case "end":
                    return _context22.stop();
                }
              }
            });
          })));

        case 11:
          movies = _context23.sent;
          // Sắp xếp các phim dựa trên số lượng thể loại khớp và rating trung bình
          movies.sort(function (a, b) {
            if (b.matchedGenres !== a.matchedGenres) {
              return b.matchedGenres - a.matchedGenres;
            }

            return b.averageRating - a.averageRating;
          });
          res.json(movies.slice(0, 8)); // Giới hạn kết quả đến 6 phim

          _context23.next = 20;
          break;

        case 16:
          _context23.prev = 16;
          _context23.t0 = _context23["catch"](0);
          console.error('Error fetching similar movies:', _context23.t0);
          res.status(500).send('Server Error');

        case 20:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.getTopRatedMoviesByGenre = function _callee22(req, res) {
  var genre, movies, movieIds, topRatedMovies, result;
  return regeneratorRuntime.async(function _callee22$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          _context24.prev = 0;
          genre = req.query.genre;

          if (genre) {
            _context24.next = 4;
            break;
          }

          return _context24.abrupt("return", res.status(400).json({
            message: 'Genre is required'
          }));

        case 4:
          _context24.next = 6;
          return regeneratorRuntime.awrap(MovieModel.find({
            genre: genre
          }));

        case 6:
          movies = _context24.sent;
          // Lấy danh sách các movieId
          movieIds = movies.map(function (movie) {
            return movie._id;
          }); // Tính trung bình rating của từng movie và sắp xếp theo rating giảm dần

          _context24.next = 10;
          return regeneratorRuntime.awrap(RatingModel.aggregate([{
            $match: {
              movieId: {
                $in: movieIds
              }
            }
          }, {
            $group: {
              _id: '$movieId',
              averageRating: {
                $avg: '$rating'
              }
            }
          }, {
            $sort: {
              averageRating: -1
            }
          }, {
            $limit: 5
          }, {
            $lookup: {
              from: 'movies',
              localField: '_id',
              foreignField: '_id',
              as: 'movie'
            }
          }, {
            $unwind: '$movie'
          }]));

        case 10:
          topRatedMovies = _context24.sent;
          result = topRatedMovies.map(function (item) {
            return _objectSpread({}, item.movie, {
              averageRating: item.averageRating
            });
          });
          res.status(200).json(result);
          _context24.next = 19;
          break;

        case 15:
          _context24.prev = 15;
          _context24.t0 = _context24["catch"](0);
          console.error('Error fetching top rated movies:', _context24.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 19:
        case "end":
          return _context24.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.getTop10Movies = function _callee23(req, res) {
  var topMovies;
  return regeneratorRuntime.async(function _callee23$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          _context25.prev = 0;
          _context25.next = 3;
          return regeneratorRuntime.awrap(RatingModel.aggregate([{
            $group: {
              _id: "$movieId",
              averageRating: {
                $avg: "$rating"
              }
            }
          }, {
            $sort: {
              averageRating: -1
            }
          }, {
            $limit: 10
          }, {
            $lookup: {
              from: "movies",
              localField: "_id",
              foreignField: "_id",
              as: "movieDetails"
            }
          }, {
            $unwind: "$movieDetails"
          }, {
            $project: {
              _id: 0,
              movieDetails: 1,
              averageRating: 1
            }
          }]));

        case 3:
          topMovies = _context25.sent;
          res.json(topMovies.map(function (item) {
            return _objectSpread({}, item.movieDetails, {
              averageRating: item.averageRating
            });
          }));
          _context25.next = 11;
          break;

        case 7:
          _context25.prev = 7;
          _context25.t0 = _context25["catch"](0);
          console.error(_context25.t0);
          res.status(500).json({
            error: 'Failed to fetch top movies'
          });

        case 11:
        case "end":
          return _context25.stop();
      }
    }
  }, null, null, [[0, 7]]);
};