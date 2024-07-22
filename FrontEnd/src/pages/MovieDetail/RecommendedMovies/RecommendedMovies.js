import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendedMovies.module.css';
import { FaPlay, FaCheckCircle, FaStar } from 'react-icons/fa';
import { IoIosAddCircle } from "react-icons/io";
import { getCookie } from '../../../utils/Cookies';
import { notifyError, notifySuccess, notifyWarning } from '../../../components/public/Notification/Notification';
import Loading from '../../../components/public/LoadingEffect/Loading';

const RecommendedMovies = ({ genres, currentMovieId }) => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [watchlists, setWatchlists] = useState({});
  const [ratings, setRatings] = useState({});
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [hoveredStarMovie, setHoveredStarMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const genreItemsRef = useRef([]);
  const token = getCookie('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        console.log('Fetching recommended movies for genres:', genres, 'and current movie ID:', currentMovieId);
        const response = await fetch('http://localhost:5000/public/get-recommended-movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ genres, currentMovieId })
        });
        const data = await response.json();
        console.log('Fetched recommended movies:', data);

        setRecommendedMovies(data);
        if (token) {
          const fetchAllRatings = data.map(movie => fetchUserRating(movie._id));
          await Promise.all(fetchAllRatings);
        }
      } catch (error) {
        console.log('Error fetching recommended movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedMovies();
  }, [genres, currentMovieId, token]);

  const handleNextClick = (index) => {
    const genreItems = genreItemsRef.current[index];
    if (genreItems) {
      const maxScrollLeft = genreItems.scrollWidth - genreItems.clientWidth;
      let currentScrollPosition = genreItems.scrollLeft;
      currentScrollPosition = currentScrollPosition >= maxScrollLeft ? 0 : currentScrollPosition + 200;
      genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
    }
  };

  const handlePrevClick = (index) => {
    const genreItems = genreItemsRef.current[index];
    if (genreItems) {
      let currentScrollPosition = genreItems.scrollLeft;
      currentScrollPosition = currentScrollPosition <= 0 ? genreItems.scrollWidth - genreItems.clientWidth : currentScrollPosition - 200;
      genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
    }
  };

  const handleWatchClickRecommended = async (movieId) => {
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
    <div className={styles.recommendedSection}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h2 className={styles.recommendedTitle}>Recommended Movies</h2>
          <div className={styles.recommendedList}>
            <button className={styles.prevRecommended} onClick={() => handlePrevClick(0)}>&lt;</button>
            <div className={styles.recommendedItems} ref={(el) => genreItemsRef.current[0] = el}>
              {recommendedMovies.length > 0 ? (
                recommendedMovies.map((recommendedMovie) => (
                  <div
                    key={recommendedMovie._id}
                    className={styles.recommendedItem}
                    onMouseEnter={() => {
                      setHoveredMovie(recommendedMovie._id);
                      fetchUserRating(recommendedMovie._id);
                    }}
                    onMouseLeave={() => setHoveredMovie(null)}
                  >
                    <div className={styles.recommendedImageContainer}>
                      <img src={recommendedMovie.poster_url} alt={recommendedMovie.title} />
                      <div className={styles.hoverSection}>
                        <div className={styles.topSection} style={{ backgroundImage: `url(${recommendedMovie.background_url})` }}></div>
                        <div className={styles.bottomSection}>
                          <div className={styles.topLeft}>
                            <div className={styles.progressBarHover} style={{ width: `${(ratings[recommendedMovie._id] || 0) * 20}%` }}></div>
                            <div className={styles.buttonComb}>
                              <button className={styles.watchButton} onClick={() => handleWatchClickRecommended(recommendedMovie._id)}><FaPlay /></button>
                              <button className={styles.addToFavoritesButton} onClick={() => handleFavoriteClick(recommendedMovie._id)}>
                                {watchlists[recommendedMovie._id] ? <FaCheckCircle /> : <IoIosAddCircle className={styles.plus} />}
                              </button>
                              <div
                                className={styles.ratingContainer}
                                onMouseEnter={() => setHoveredStarMovie(recommendedMovie._id)}
                                onMouseLeave={() => setHoveredStarMovie(null)}
                              >
                                <div className={styles.starContainer}>
                                  <FaStar
                                    className={styles.star}
                                    onClick={() => handleRatingClick(recommendedMovie._id, 1)}
                                    style={{
                                      color: (ratings[recommendedMovie._id] || 0) >= 1 ? '#ffc107' : '#e4e5e9'
                                    }}
                                  />
                                </div>
                                {hoveredStarMovie === recommendedMovie._id && (
                                  [...Array(4)].map((_, i) => (
                                    <div key={i} className={styles.starContainer}>
                                      <FaStar
                                        className={styles.star}
                                        onClick={() => handleRatingClick(recommendedMovie._id, i + 2)}
                                        style={{
                                          color: i + 2 <= (ratings[recommendedMovie._id] || 0) ? '#ffc107' : '#e4e5e9'
                                        }}
                                      />
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                            <div className={styles.genre}>{truncateDescription(recommendedMovie.full_description, recommendedMovie._id)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.recommendedContent}>
                      <div className={styles.recommendedItemTitle}>{recommendedMovie.title}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No recommended movies found</div>
              )}
            </div>
            <button className={styles.nextRecommended} onClick={() => handleNextClick(0)}>&gt;</button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendedMovies;
