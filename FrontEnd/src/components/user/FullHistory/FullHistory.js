import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../../utils/Cookies';
import { AuthContext } from '../../auth/AuthContext';
import styles from './FullHistory.module.css';
import Notification, { notifyError, notifySuccess } from '../../public/Notification/Notification';
import Loading from '../../public/LoadingEffect/Loading';

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const FullHistory = () => {
  const [history, setHistory] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const navigate = useNavigate();
  const { authStatus } = useContext(AuthContext);
  const token = getCookie('jwt');

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
    if (authStatus.loggedIn) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [authStatus.loggedIn]);

  const handleHistoryClick = (movieId) => {
    if (!isSelecting) {
      sessionStorage.setItem('hasReloaded', 'false');
      navigate(`/streaming/${movieId}`);
    } else {
      handleSelectMovie(movieId);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/remove-history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieIds: selectedMovies })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const updatedHistory = history.filter(item => !selectedMovies.includes(item.movie._id));
      setHistory(updatedHistory);
      setSelectedMovies([]);
      notifySuccess('Deleted selected history successfully!');
    } catch (error) {
      notifyError(error.message);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allMovieIds = history.map(item => item.movie._id);
      setSelectedMovies(allMovieIds);
    } else {
      setSelectedMovies([]);
    }
  };

  const handleSelectMovie = (movieId) => {
    if (selectedMovies.includes(movieId)) {
      setSelectedMovies(selectedMovies.filter(id => id !== movieId));
    } else {
      setSelectedMovies([...selectedMovies, movieId]);
    }
  };

  const toggleSelectMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedMovies([]);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.historyContainer}>
      <Notification />
      {history.length === 0 ? (
        <div className={styles.noHistory}>No history available</div>
      ) : (
        <div className={styles.fixedHeader}>
          <h1 className={styles.h2}>History</h1>
          <div className={styles.buttonGroup}>
            {isSelecting && (
              <>
                <input
                  type="checkbox"
                  className={styles.checkboxAll}
                  onChange={handleSelectAll}
                  checked={selectedMovies.length === history.length}
                />
                <span>Select All</span>
                <button
                  className={styles.deleteSelectedButton}
                  onClick={handleDeleteSelected}
                  disabled={selectedMovies.length === 0}
                >
                  Delete Selected
                </button>
              </>
            )}
            <button
              className={styles.selectButton}
              onClick={toggleSelectMode}
            >
              {isSelecting ? 'Cancel' : 'Select'}
            </button>
          </div>
        </div>
      )}
      <div className={styles.gridContainer}>
        {history.map((item) => {
          const currentTime = formatTime(item.currentTime);
          const totalTime = item.movie && item.movie.duration ? formatTime(item.movie.duration * 60) : '00:00:00';
          const progressPercentage = item.movie && item.movie.duration ? (item.currentTime / (item.movie.duration * 60)) * 100 : 0;

          return (
            <div key={item._id} className={styles.gridItem} onClick={() => handleHistoryClick(item.movie._id)}>
              <div className={`${styles.imageContainer} ${isSelecting ? styles.selecting : ''}`}>
                {isSelecting && (
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    onChange={() => handleSelectMovie(item.movie._id)}
                    checked={selectedMovies.includes(item.movie._id)}
                  />
                )}
                <img src={item.movie.background_url} alt={item.movie.title} className={styles.backgroundImage} />
                <div className={styles.overlay}></div>
                {item.movie.type === 'series' && item.latestEpisode !== undefined ? (
                  <p className={styles.episodeInfo}>Watch to Episode {item.latestEpisode}</p>
                ) : null}
                <div className={styles.timeInfo}>
                  {currentTime}/{totalTime}
                </div>
              </div>
              <div className={styles.historyDetails}>
                <div className={styles.progressBar}>
                  <div className={styles.progress} style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
              <h3 className={styles.movieTitle}>{item.movie.title}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FullHistory;
