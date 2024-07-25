import React, { useState, useEffect, useRef, useContext } from 'react';
import { getCookie } from '../../../../utils/Cookies';
import { AuthContext } from '../../../../components/auth/AuthContext';
import { FaRegClock, FaBoxOpen } from "react-icons/fa";
import styles from './History.module.css';
import { useNavigate } from 'react-router-dom';

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const History = ({ setCurrentFunction }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const historyRef = useRef(null);
  const { authStatus } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleMouseEnter = () => {
    setShowHistory(true);
  };

  const handleMouseLeave = (event) => {
    if (!historyRef.current.contains(event.relatedTarget)) {
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (movieId) => {
    sessionStorage.setItem('hasReloaded', 'false');
    navigate(`/streaming/${movieId}`);
  };

  const handleSeeMoreClick = () => {
    if (setCurrentFunction) {
      setCurrentFunction('My History');
    }
    navigate('/user');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleDropdownClick = () => {
    if (!authStatus.loggedIn) {
      handleLoginClick();
    }
  };

  const displayedHistory = history.slice(0, 3);

  return (
    <div className={styles.historyContainer} ref={historyRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className={styles.historyButton}>
        <FaRegClock className={styles.historyIcon}/>
      </button>
      <div className={styles.historyGap}></div> {/* Invisible gap */}
      {showHistory && (
        <div
          className={styles.historyDropdown}
          onClick={handleDropdownClick} // Handle click on dropdown to navigate to login if not logged in
        >
          {!authStatus.loggedIn ? (
            <div className={styles.historyMessage}>
              <FaBoxOpen className={styles.historyMessageIcon} />
              <div className={styles.historyMessageText}>
                Login to track your watch history
              </div>
              <button
                className={styles.historyLoginButton}
                onClick={handleLoginClick}
              >
                Login
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className={styles.historyMessage}>
              <FaBoxOpen className={styles.historyMessageIcon} />
              <div className={styles.historyMessageText}>
                None of watch history are restored
              </div>
            </div>
          ) : (
            <>
              {displayedHistory.map((item) => {
                const currentTime = formatTime(item.currentTime);
                const totalTime = item.movie && item.movie.duration ? formatTime(item.movie.duration * 60) : '00:00:00';
                const progressPercentage = item.movie && item.movie.duration ? (item.currentTime / (item.movie.duration * 60)) * 100 : 0;

                return (
                  <div key={item._id} className={styles.historyItem} onClick={() => handleHistoryClick(item.movie._id)}>
                    <img src={item.movie.background_url} alt={item.movie.title} className={styles.backgroundImage} />
                    <div className={styles.historyDetails}>
                      <h3 className={styles.movieTitle}>{item.movie.title}</h3>
                      {item.movie.type === 'series' && item.latestEpisode !== undefined && (
                        <p className={styles.episodeInfo}>Watched Up to Ep {item.latestEpisode}</p>
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
              })}
              {history.length > 3 && (
                <button
                  className={styles.showMoreButton}
                  onClick={handleSeeMoreClick}
                >
                  See More
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
