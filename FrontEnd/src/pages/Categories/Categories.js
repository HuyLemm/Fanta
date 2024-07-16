import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Categories.module.css';
import Footer from '../../components/public/Footer/Footer';
import Notification, { notifyError, notifySuccess, notifyWarning } from '../../components/public/Notification/Notification';
import Loading from '../../components/public/LoadingEffect/Loading';
import { FaPlay, FaCheckCircle, FaStar } from 'react-icons/fa';
import { IoIosAddCircle } from "react-icons/io";
import { getCookie } from '../../utils/Cookies';

const GenreMovies = () => {
  const { genreName } = useParams();
  const [movies, setMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 25;
  const navigate = useNavigate();
  const token = getCookie('jwt');
  const [watchlists, setWatchlists] = useState({});
  const [ratings, setRatings] = useState({});
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [hoveredStarMovie, setHoveredStarMovie] = useState(null);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-movies-by-genre?genre=${genreName}`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        notifyError('Error fetching movies:', error);
      }
    };

    const fetchTopRatedMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-top-rated-movies-by-genre?genre=${genreName}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTopRatedMovies(data);
      } catch (error) {
        notifyError('Error fetching top rated movies:', error);
      }
    };

    if (genreName) {
      fetchGenreMovies();
      fetchTopRatedMovies();
    }
  }, [genreName]);

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleFavoriteClick = async (movieId) => {
    if (!token) {
      notifyWarning('You need to log in first to archive');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user/toggle-watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setWatchlists(prevWatchlists => ({
        ...prevWatchlists,
        [movieId]: data.isFavourite
      }));
      notifySuccess(data.message);
    } catch (error) {
      notifyError('Error updating favorites:', error);
    }
  };

  const fetchUserRating = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/public/get-rating-hover/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched rating for movie:', movieId, data);
      const userRate = data ? data.rating : 0;
      const newRatings = {
        ...ratings,
        [movieId]: userRate
      };
      setRatings(newRatings);
    } catch (error) {
      console.log('Fetch rating error:', error);
    }
  };

  const handleRatingClick = async (movieId, rating) => {
    if (!token) {
      notifyWarning('You need to log in first to rate');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/user/add-and-update-rating/${movieId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating })
      });

      if (!response.ok) {
        throw new Error('Failed to add rating');
      }

      const newRating = await response.json();
      const updatedRatings = {
        ...ratings,
        [movieId]: newRating.rating
      };
      setRatings(updatedRatings);
    } catch (error) {
      notifyError('Add rating error:', error);
    }
  };

  const truncateDescription = (description, movieId) => {
    if (!description) return '';
    
    const lines = description.split(' ');
    if (lines.length > 10) {
      return (
        <>
          {lines.slice(0, 12).join(' ')}...{' '}
          <div className={styles.seeMore} onClick={() => handleMoreDetailsClick(movieId)}>
            More Details
          </div>
        </>
      );
    }
    return description;
  };

  const handleMoreDetailsClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(movies.length / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.genreMoviesPage}>
      <Notification />
      <div className={styles.overlay}></div>
      <div className={styles.outerContainer}>
        <div className={styles.genreMoviesContainer}>
          <div className={styles.mainContent}>
            <h2 className={styles.h2}>Movies in {genreName}</h2>
            <div className={styles.moviesGrid}>
              {currentMovies.length > 0 ? (
                currentMovies.map((movie) => (
                  <div 
                    key={movie._id} 
                    className={styles.movieItem}
                    onMouseEnter={() => {
                      setHoveredMovie(movie._id);
                      fetchUserRating(movie._id);
                    }}
                    onMouseLeave={() => setHoveredMovie(null)}
                  >
                    <div className={styles.imageContainer}>
                      <img src={movie.poster_url} alt={movie.title} className={styles.moviePoster} />
                      <div className={styles.hoverSection}>
                        <div className={styles.topSection} style={{ backgroundImage: `url(${movie.background_url})` }}></div>
                        <div className={styles.bottomSection}>
                          <div className={styles.topLeft}>
                            <div className={styles.buttonComb}>
                              <button className={styles.watchButton} onClick={() => handleWatchClick(movie._id)}><FaPlay /></button>
                              <button className={styles.addToFavoritesButton} onClick={() => handleFavoriteClick(movie._id)}>
                                {watchlists[movie._id] ? <FaCheckCircle /> : <IoIosAddCircle className={styles.plus} />}
                              </button>
                              <div 
                                className={styles.ratingContainer}
                                onMouseEnter={() => setHoveredStarMovie(movie._id)}
                                onMouseLeave={() => setHoveredStarMovie(null)}
                              >
                                <div className={styles.starContainer}>
                                  <FaStar
                                    className={styles.star}
                                    onClick={() => handleRatingClick(movie._id, 1)}
                                    style={{
                                      color: (ratings[movie._id] || 0) >= 1 ? '#ffc107' : '#e4e5e9'
                                    }}
                                  />
                                </div>
                                {hoveredStarMovie === movie._id && (
                                  [...Array(4)].map((_, i) => (
                                    <div key={i} className={styles.starContainer}>
                                      <FaStar
                                        className={styles.star}
                                        onClick={() => handleRatingClick(movie._id, i + 2)}
                                        style={{
                                          color: i + 2 <= (ratings[movie._id] || 0) ? '#ffc107' : '#e4e5e9'
                                        }}
                                      />
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                            <div className={styles.genre}>{truncateDescription(movie.full_description, movie._id)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div><Loading /></div>
              )}
            </div>
            <div className={styles.pagination}>
              {pageNumbers.map(number => (
                <button key={number} onClick={() => handleClick(number)} className={styles.pageButton}>
                  {number}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.sidebar}>
              <h3 className={styles.topRatedHeader}>Top 5 in {genreName}</h3>
              <ul className={styles.topRatedList}>
                {topRatedMovies.map(movie => (
                  <li key={movie._id} className={styles.topRatedItem}>
                    <div className={styles.topRatedMovie}>
                      <img src={movie.poster_url} alt={movie.title} className={styles.topRatedPoster} />
                      <div className={styles.topRatedDetails}>
                        <p>{movie.title}</p>
                        <p> ♥ {movie.averageRating.toFixed(1)}/5.0</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
          </div>
        </div>
      </div>
      <div className={styles.footerSection}><Footer /></div>
    </div>
  );
};

export default GenreMovies;
