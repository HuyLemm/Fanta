import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../../utils/Cookies';
import { AuthContext } from '../../auth/AuthContext';
import styles from './FullHistory.module.css';

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const FullHistory = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const { authStatus } = useContext(AuthContext);

  const fetchHistory = async () => {
    const token = getCookie('jwt');
    if (!token) {
      setHistory([]);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/public/get-history-for-user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status !== 401) {
          console.error('Failed to fetch history:', response.statusText);
        }
        setHistory([]);
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setHistory([]);
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
    sessionStorage.setItem('hasReloaded', 'false');
    navigate(`/streaming/${movieId}`);
  };

  return (
    <div className={styles.historyContainer}>
      <h1 className={styles.heading}>History</h1>
      {history.length === 0 ? (
        <div className={styles.noHistory}>No history available</div>
      ) : (
        <div className={styles.gridContainer}>
          {history.map((item) => {
            const currentTime = formatTime(item.currentTime);
            const totalTime = item.movie && item.movie.duration ? formatTime(item.movie.duration * 60) : '00:00:00';
            const progressPercentage = item.movie && item.movie.duration ? (item.currentTime / (item.movie.duration * 60)) * 100 : 0;

            return (
              <div key={item._id} className={styles.gridItem} onClick={() => handleHistoryClick(item.movie._id)}>
                <div className={styles.imageContainer}>
                  <img src={item.movie.background_url} alt={item.movie.title} className={styles.backgroundImage} />
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
      )}
    </div>
  );
};

export default FullHistory;
