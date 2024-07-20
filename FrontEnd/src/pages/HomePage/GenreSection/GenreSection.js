import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './GenreSection.module.css';
import { notifyError, notifySuccess, notifyWarning } from '../../../components/public/Notification/Notification';
import { GrNext, GrPrevious } from "react-icons/gr";
import { FaPlay, FaCheckCircle, FaStar } from 'react-icons/fa';
import { FaPlusCircle } from "react-icons/fa";
import { getCookie } from '../../../utils/Cookies';
import Loading from '../../../components/public/LoadingEffect/Loading';

const GenreSection = ({ type }) => {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [history, setHistory] = useState([]);
  const token = getCookie('jwt');
  const genreItemsRef = useRef([]);
  const [genres, setGenres] = useState([]);
  const [watchlists, setWatchlists] = useState({});
  const [ratings, setRatings] = useState({});
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [hoveredStarMovie, setHoveredStarMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchGenres = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-genres-movie?type=${type || ''}`);
        let data = await response.json();
        console.log('Fetched genres:', data);

        // Shuffle movies within each genre
        data.forEach(genre => {
          genre.movies = genre.movies.sort(() => 0.5 - Math.random());
        });

        const sortedGenres = data.sort((a, b) => b.movies.length - a.movies.length);
        const topGenres = sortedGenres.slice(0, 3);

        setGenres(topGenres);
        if (token) {
          const fetchAllRatings = topGenres.flatMap(genre =>
            genre.movies.map(movie => fetchUserRating(movie._id))
          );
          await Promise.all(fetchAllRatings);
        }
      } catch (error) {
        console.log('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/public/get-current-user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched current user:', data);
        setCurrentUser(data);
      } catch (error) {
        console.log('Error fetching current user:', error);
      }
    };

    fetchGenres();
    fetchCurrentUser();
    fetchHistory();
  }, [type, token]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/public/get-history-for-user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched history:', data);
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hoveredMovie) {
      fetchUserRating(hoveredMovie);
    }
  }, [hoveredMovie]);

  const scrollAmount = 200;

  const handleNextClick = (index) => {
    const genreItems = genreItemsRef.current[index];
    if (genreItems) {
      const maxScrollLeft = genreItems.scrollWidth - genreItems.clientWidth;
      let currentScrollPosition = genreItems.scrollLeft;
      currentScrollPosition = currentScrollPosition >= maxScrollLeft ? 0 : currentScrollPosition + scrollAmount;
      genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
    }
  };

  const handlePrevClick = (index) => {
    const genreItems = genreItemsRef.current[index];
    if (genreItems) {
      let currentScrollPosition = genreItems.scrollLeft;
      currentScrollPosition = currentScrollPosition <= 0 ? genreItems.scrollWidth - genreItems.clientWidth : currentScrollPosition - scrollAmount;
      genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
    }
  };

  const handleWatchClick = async (movieId) => {
    const fetchWatchHistory = async (movieId) => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-history/${movieId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to load watch history');
        }
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Failed to load watch history:', err);
        return null;
      }
    };

    sessionStorage.setItem('hasReloaded', 'false');
    if (token) {
      const history = await fetchWatchHistory(movieId); // Fetch watch history for the specific movie
      if (history) {
        navigate(`/streaming/${movieId}`, { state: { time: history.currentTime, episode: history.latestEpisode - 1 } });
      } else {
        navigate(`/streaming/${movieId}`);
      }
    } else {
      navigate(`/streaming/${movieId}`);
    }
  };

  const handleMoreDetailsClick = (movieId) => {
    navigate(`/movie/${movieId}`);
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

  return (
    <div className={styles.genreSectionsContainer}>
      {loading ? (
        <Loading />
      ) : (
        <>
          {currentUser && history.length > 0 && (
            <div className={styles.genreSection}>
              <h2>Continue Watching for {currentUser.username}</h2>
              <div className={styles.genreList}>
                <button className={styles.prevGenre} onClick={() => handlePrevClick('continue')}><GrPrevious /></button>
                <div className={styles.genreItems} ref={(el) => genreItemsRef.current['continue'] = el}>
                  {history.map((historyItem, movieIndex) => {
                    const movie = historyItem.movie;
                    const progress = (historyItem.currentTime / (movie.duration * 60)) * 100;
                    return (
                      <div 
                        className={styles.item} 
                        key={movieIndex}
                        onMouseEnter={() => setHoveredMovie(movie._id)}
                        onMouseLeave={() => setHoveredMovie(null)}
                      >
                        <div className={styles.imageContainer}>
                          <img src={movie.poster_url} alt={movie.title} />
                          <div className={styles.hoverSection}>
                            <div className={styles.topSection} style={{ backgroundImage: `url(${movie.background_url})` }}></div>
                            <div className={styles.bottomSection}>
                              <div className={styles.topLeft}>
                                <div className={styles.progressBarHover} style={{ width: `${progress}%` }}></div>
                                <div className={styles.buttonComb}>
                                  <button className={styles.watchButton} onClick={() => handleWatchClick(movie._id)}><FaPlay /></button>
                                  <button className={styles.addToFavoritesButton} onClick={() => handleFavoriteClick(movie._id)}>
                                    {watchlists[movie._id] ? <FaCheckCircle /> : <FaPlusCircle className={styles.plus} />}
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
                                          color: hoveredStarMovie === movie._id || (ratings[movie._id] || 0) >= 1 ? '#ffc107' : '#e4e5e9'
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
                        <div className={styles.content}>
                          <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                          <div className={styles.title}>{movie.title}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className={styles.nextGenre} onClick={() => handleNextClick('continue')}><GrNext /></button>
              </div>
            </div>
          )}
          {genres.length > 0 && genres.map((genre, index) => (
            <div key={index} className={styles.genreSection}>
              <h2>{genre.name + (type === 'series' ? ' Series' : ' Movies')}</h2>
              <div className={styles.genreList}>
                <button className={styles.prevGenre} onClick={() => handlePrevClick(index)}><GrPrevious /></button>
                <div className={styles.genreItems} ref={(el) => genreItemsRef.current[index] = el}>
                  {genre.movies && genre.movies.map((movie, movieIndex) => {
                    return (
                      <div 
                        className={styles.item} 
                        key={movieIndex}
                        onMouseEnter={() => setHoveredMovie(movie._id)}
                        onMouseLeave={() => setHoveredMovie(null)}
                      >
                        <div className={styles.imageContainer}>
                          <img src={movie.poster_url} alt={movie.title} />
                          <div className={styles.hoverSection}>
                            <div className={styles.topSection} style={{ backgroundImage: `url(${movie.background_url})` }}></div>
                            <div className={styles.bottomSection}>
                              <div className={styles.topLeft}>
                                <div className={styles.buttonComb}>
                                  <button className={styles.watchButton} onClick={() => handleWatchClick(movie._id)}><FaPlay /></button>
                                  <button className={styles.addToFavoritesButton} onClick={() => handleFavoriteClick(movie._id)}>
                                    {watchlists[movie._id] ? <FaCheckCircle /> : <FaPlusCircle className={styles.plus} />}
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
                        <div className={styles.content}>
                          <div className={styles.title}>{movie.title}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className={styles.nextGenre} onClick={() => handleNextClick(index)}><GrNext /></button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default GenreSection;
