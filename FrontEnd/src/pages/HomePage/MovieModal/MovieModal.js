import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import YouTube from 'react-youtube';
import styles from './MovieModal.module.css';
import { IoIosCloseCircle } from "react-icons/io";
import { FaPlay, FaPlusCircle, FaStar, FaVolumeMute, FaVolumeUp, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { notifyError, notifySuccess, notifyWarning } from '../../../components/public/Notification/Notification';
import { capitalizeFirstLetter } from '../../../utils/Function';
import { getCookie } from '../../../utils/Cookies';


Modal.setAppElement('#root');

const MovieModal = ({ isOpen, onRequestClose, movie }) => {
  const [fullMovie, setfullMovie] = useState({});
  const [averageRating, setAverageRating] = useState(0); 
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const token = getCookie('jwt');
  const [watchlists, setWatchlists] = useState({});
  const [ratings, setRatings] = useState({});
  const [hoveredStar, setHoveredStar] = useState(false);


  const fetchMovie = async () => {
    try {
      const response = await fetch(`http://localhost:5000/public/get-movie-by-id/${movie.id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setfullMovie(data);
    } catch (error) {
      console.log('Fetch movie error:', error);
      console.log(error.message);
    } 
  };

  useEffect(() => {
    if (isOpen) {
      fetchMovie();
    }
  }, [isOpen]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.getIframe()) {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isMuted]);

  useEffect(() => {
    if (movie && token) {
      fetchFavoriteStatus(movie.id);
      fetchUserRating(movie.id);
      fetchAverageRating(movie.id)
    }
  }, [movie, token]);

  if (!movie) return null;

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const trailerId = getYouTubeId(movie.trailer_url);

  const videoOptions = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      mute: isMuted ? 1 : 0,
      iv_load_policy: 3,
      loop: 1,
      playlist: trailerId,
    },
    width: '100%',
    height: '100%'
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    if (isMuted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }
  };

  const toggleMute = () => {
    if (playerRef.current && playerRef.current.getIframe()) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const fetchAverageRating = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/public/get-average-rating/${movieId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setAverageRating(data.averageRating);
    } catch (error) {
      notifyError('Fetch average rating error:', error);
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
      const history = await fetchWatchHistory(movieId);
      if (history) {
        navigate(`/streaming/${movieId}`, { state: { time: history.currentTime, episode: history.latestEpisode - 1 } });
      } else {
        navigate(`/streaming/${movieId}`);
      }
    } else {
      navigate(`/streaming/${movieId}`);
    }
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

  const fetchFavoriteStatus = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/public/get-watchlist/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setWatchlists(prevWatchlists => ({
        ...prevWatchlists,
        [movieId]: data.isFavourite
      }));
    } catch (error) {
      console.error('Fetch favorite status error:', error);
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
      setRatings(prevRatings => ({
        ...prevRatings,
        [movieId]: newRating.rating
      }));
    } catch (error) {
      notifyError('Add rating error:', error);
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
      const userRate = data ? data.rating : 0;
      setRatings(prevRatings => ({
        ...prevRatings,
        [movieId]: userRate
      }));
    } catch (error) {
      console.log('Fetch rating error:', error);
    }
  };

  const averageDuration = fullMovie.type === 'series' && fullMovie.episodes && fullMovie.episodes.length > 0
    ? Math.round(fullMovie.episodes.reduce((total, episode) => total + episode.duration, 0) / fullMovie.episodes.length)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.content}>
        <button className={styles.closeButton} onClick={onRequestClose}>
          <IoIosCloseCircle />
        </button>
        <div className={styles.videoWrapper}>
          {trailerId && (
            <YouTube
              videoId={trailerId}
              opts={videoOptions}
              className={styles.video}
              onReady={onReady}
            />
          )}
          <div className={styles.buttons}>
            <button className={styles.playButton} onClick={() => handleWatchClick(movie.id)}><FaPlay />&nbsp;Play</button>
            <button className={styles.addToListButton} onClick={() => handleFavoriteClick(movie.id)}>
              {watchlists[movie.id] ? <FaCheckCircle /> : <FaPlusCircle />}
            </button>
            <div
              className={styles.ratingContainer}
              onMouseEnter={() => setHoveredStar(true)}
              onMouseLeave={() => setHoveredStar(false)}
            >
              <div className={styles.starButton}>
                <FaStar
                  className={styles.star}
                  onClick={() => handleRatingClick(movie.id, 1)}
                  style={{
                    color: (ratings[movie.id] || 0) >= 1 ? '#ffc107' : '#e4e5e9'
                  }}
                />
              </div>
              {hoveredStar  && (
                [...Array(4)].map((_, i) => (
                  <div key={i} className={styles.starButton}>
                    <FaStar
                      className={styles.star}
                      onClick={() => handleRatingClick(movie.id, i + 2)}
                      style={{
                        color: i + 2 <= (ratings[movie.id] || 0) ? '#ffc107' : '#e4e5e9'
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className={styles.muteButtonContainer}>
            <button className={styles.muteButton} onClick={toggleMute}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.left}>
            <p className={styles.metaFrame}>
              <span className={styles.quality}>HD</span>
              <span className={styles.rating}>{averageRating.toFixed(1)}&nbsp;<FaStar className={styles.staricon} /></span>
              <span className={styles.releaseDate}>{new Date(movie.release_date).getFullYear()}</span>
              {movie.type === 'movie' ? (
                <span className={styles.rating}><FaClock className={styles.clockicon}/>&nbsp;{movie.duration}mins</span>
              ) : (
                <span className={styles.rating}><FaClock className={styles.clockicon}/>&nbsp;{averageDuration}mins/episode</span>
              )}
              <span className={styles.releaseDate}>{capitalizeFirstLetter(movie.type)}</span>
            </p>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.description}>{movie.brief_description}</p>
          </div>
          <div className={styles.right}>
            <div className={styles.metaitem}>
              <h2 className={styles.sect}>Genre:</h2>
              <p>{movie.genre.join(', ')}</p>
            </div>
            <div className={styles.cast}>
              <h2 className={styles.sect}>Cast: </h2>
              <p>{movie.cast.join(', ')}</p>
            </div>
            <div className={styles.metaitem}>
              <h2 className={styles.sect}>Director: </h2>
              <p>{movie.director.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MovieModal;
