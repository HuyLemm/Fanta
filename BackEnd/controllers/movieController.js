const User = require('./User');
const Genre = require('./Genre');
const Movie = require('./Movie');
const Review = require('./Review');
const Watchlist = require('./Watchlist');
const MovieSource = require('./MovieSource');

// Tạo một thể loại phim
exports.createGenre = async () => {
  const genre = new Genre({ name: 'Action' });
  await genre.save();
};

// Tạo một phim
exports.createMovie = async () => {
  const genre = await Genre.findOne({ name: 'Action' });
  const movie = new Movie({
    title: 'Example Movie',
    description: 'Description here',
    release_date: new Date(),
    duration: 120,
    genre: genre._id,
    director: 'John Doe',
    cast: ['Actor 1', 'Actor 2'],
    rating: 8.5,
    poster_url: 'http://example.com/poster.jpg',
    trailer_url: 'http://example.com/trailer.mp4'
  });
  await movie.save();
};

// Tạo một đánh giá
exports.createReview = async (userId, movieId) => {
  const review = new Review({
    user: userId,
    movie: movieId,
    rating: 5,
    comment: 'Great movie!'
  });
  await review.save();
};

// Tạo danh sách xem
exports.createWatchlist = async (userId, movieId) => {
  const watchlist = new Watchlist({
    user: userId,
    movie: movieId
  });
  await watchlist.save();
};

// Tạo nguồn phim
exports.createMovieSource = async (movieId) => {
  const source = new MovieSource({
    movie: movieId,
    source_url: 'http://example.com/movie.mp4',
    quality: '1080p',
    language: 'English'
  });
  await source.save();
};

// Lấy danh sách phim theo thể loại
exports.getMoviesByGenre = async (genreName) => {
  const genre = await Genre.findOne({ name: genreName });
  const movies = await Movie.find({ genre: genre._id }).populate('genre');
  return movies;
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
 
