import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../../../utils/Cookies';
import { AuthContext } from '../../../../components/auth/AuthContext';
import styles from './History.module.css';

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const History = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const historyRef = useRef(null);
  const { authStatus } = useContext(AuthContext);

  const fetchHistory = async () => {
    const token = getCookie('jwt');
    if (!token) {
      setHistory(null);
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
      setHistory(null);
    }
  }, [authStatus.loggedIn]);

  const handleClickOutside = (event) => {
    if (historyRef.current && !historyRef.current.contains(event.target)) {
      setShowHistory(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleHistoryClick = (movieId) => {
    sessionStorage.removeItem('hasReloaded');
    navigate(`/streaming/${movieId}`);
  };

  return (
    <div className={styles.historyContainer} ref={historyRef}>
      <button
        className={styles.historyButton}
        onMouseEnter={() => setShowHistory(true)}
        onMouseLeave={() => setShowHistory(false)}
      >
        History
      </button>
      {showHistory && (
        <div
          className={styles.historyDropdown}
          onMouseEnter={() => setShowHistory(true)}
          onMouseLeave={() => setShowHistory(false)}
        >
          {history === null ? (
            <div className={styles.historyItem}>
              <div className={styles.historyDetails}>
                <h3>No history found</h3>
              </div>
            </div>
          ) : history.length === 0 ? (
            <div className={styles.historyItem}>
              <div className={styles.historyDetails}>
                <h3>No history available</h3>
              </div>
            </div>
          ) : (
            history.map((item) => {
              const currentTime = formatTime(item.currentTime);
              const totalTime = formatTime(item.movie.duration * 60); // Assuming duration is in minutes
              const progressPercentage = (item.currentTime / (item.movie.duration * 60)) * 100;

              return (
                <div key={item._id} className={styles.historyItem} onClick={() => handleHistoryClick(item.movie._id)}>
                  <img src={item.movie.background_url} alt={item.movie.title} className={styles.backgroundImage} />
                  <div className={styles.historyDetails}>
                    <h3 className={styles.movieTitle}>{item.movie.title}</h3>
                    {item.movie.type === 'series' && (
                      <p className={styles.episodeInfo}>Watched Up to Ep {Math.floor(item.currentTime / (item.movie.duration * 60) * item.movie.episodes.length) + 1}</p>
                    )}
                    <div className={styles.progressTime}>
                      <span>{currentTime}/{totalTime}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progress} style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default History;
