import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Episode.module.css';
import { getCookie } from '../../../utils/Cookies';
import Loading from '../../../components/public/LoadingEffect/Loading';
import { useNavigate } from 'react-router-dom';

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = 0;
  return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const Episode = ({ movieId, episodes, type, initialEpisode, initialTime, genres, setInitialEpisode, setInitialTime }) => {
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [episodeImages, setEpisodeImages] = useState({});
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getCookie('jwt');
  const navigate = useNavigate();

  const fetchEpisodeImages = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/public/get-tmdb-episode-images/${movieId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const episodeImagesObject = data.reduce((acc, image, index) => {
        acc[index] = image;
        return acc;
      }, {});
      setEpisodeImages(episodeImagesObject);
    } catch (error) {
      console.log('Fetch episode images error:', error);
    }
  };

  const fetchSimilarMovies = async (genres, currentMovieId) => {
    try {
      const response = await fetch('http://localhost:5000/public/get-top-6-movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ genres, currentMovieId })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched similar movies:', data);
      setSimilarMovies(data);
    } catch (error) {
      console.log('Fetch similar movies error:', error);
    }
  };

  const saveCurrentTime = async (videoId, currentTime, latestEpisode) => {
    try {
      const response = await fetch('http://localhost:5000/public/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoId, currentTime, latestEpisode }),
      });
      if (!response.ok) {
        throw new Error('Failed to save watch time');
      }
    } catch (err) {
      console.error('Failed to save watch time:', err);
    }
  };

  const handleEpisodeChange = async (index) => {
    console.log(`Changing to episode: ${index + 1}`);
    sessionStorage.setItem('hasReloaded', 'false');
    await saveCurrentTime(movieId, 0, index + 1);
    setInitialEpisode(index);
    setCurrentEpisode(index);
    setInitialTime(0);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  useEffect(() => {
    if (type === 'series') {
      fetchEpisodeImages(movieId).then(() => setLoading(false));
    } else {
      fetchSimilarMovies(genres, movieId).then(() => setLoading(false));
    }
  }, [movieId, type, genres]);

  useEffect(() => {
    sessionStorage.setItem('currentEpisode', currentEpisode);
  }, [currentEpisode]);

  if (loading) {
    return <div><Loading /></div>;
  }

  return (
    <div className={type === 'series' ? styles.episodesSection : styles.recommendedSection}>
      {type === 'series' ? (
        <>
          <h2>Episodes</h2>
          <div className={styles.episodesContainer}>
            {episodes.map((episode, index) => (
              <div
                key={index}
                className={styles.episode}
                onClick={() => handleEpisodeChange(index)}
              >
                <div className={styles.episodeImageContainer}>
                  <img
                    src={episodeImages[index]?.image_url || 'https://via.placeholder.com/150'}
                    alt={episode.title}
                    className={styles.episodeImage}
                  />
                  <div className={styles.playButton}></div>
                  <div className={styles.episodeDuration}>{formatDuration(episode.duration)}</div>
                </div>
                <div className={styles.episodeDetails}>
                  <p className={styles.episodeNumber}>Episode {index + 1}</p>
                  <p className={styles.episodeTitle}>{episode.title}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2>Movies You Would Like</h2>
          <div className={styles.episodesContainer}>
            {similarMovies.map((movie, index) => (
              <div key={index} className={styles.movieCard} onClick={() => handleMovieClick(movie._id)}>
                <div className={styles.movieImageContainer}>
                  <img src={movie.background_url} alt={movie.title} className={styles.moviePoster} />
                  <div className={styles.playButtonMovie}></div>
                </div>
                <div className={styles.movieInfo}>
                  <p className={styles.movieGenre}>Rating: {movie.averageRating.toFixed(1)}</p>
                  <p className={styles.movieTitle}>{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

Episode.propTypes = {
  movieId: PropTypes.string.isRequired,
  episodes: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  initialEpisode: PropTypes.number,
  initialTime: PropTypes.number,
  genres: PropTypes.array.isRequired,
  setInitialEpisode: PropTypes.func.isRequired,
  setInitialTime: PropTypes.func.isRequired,
};

export default Episode;
