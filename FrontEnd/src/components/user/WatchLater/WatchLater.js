import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../../utils/Cookies';
import { AuthContext } from '../../auth/AuthContext';
import Notification, { notifyError, notifySuccess } from '../../public/Notification/Notification';
import Loading from '../../public/LoadingEffect/Loading';
import styles from './WatchLater.module.css';

const WatchLater = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const { authStatus } = useContext(AuthContext);
  const token = getCookie('jwt');
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      const response = await fetch('https://fanta-kappa.vercel.app/user/get-favorite', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus.loggedIn) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [authStatus.loggedIn]);

  const handleMovieClick = (movieId) => {
    if (!isSelecting) {
      navigate(`/movie/${movieId}`);
    } else {
      handleSelectMovie(movieId);
    }
  };

  const handleRemoveFromFavorite = async () => {
    try {
      const response = await fetch('https://fanta-kappa.vercel.app/user/remove-from-favorite', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ movieId: selectedMovies })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const updatedFavorites = favorites.filter(item => !selectedMovies.includes(item.movie._id));
      setFavorites(updatedFavorites);
      setSelectedMovies([]);
      notifySuccess('Removed selected movies from your favorites successfully!');
    } catch (error) {
      notifyError(error.message);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allMovieIds = favorites.map(item => item.movie._id);
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
    <div className={styles.watchLaterContainer}>
      <Notification />
      {favorites.length === 0 ? (
        <div className={styles.noFavorites}>No favorite movies available</div>
      ) : (
        <div className={styles.fixedHeader}>
          <h1 className={styles.h2}>Watch Later</h1>
          <div className={styles.buttonGroup}>
            {isSelecting && (
              <>
                <input
                  type="checkbox"
                  className={styles.checkboxAll}
                  onChange={handleSelectAll}
                  checked={selectedMovies.length === favorites.length}
                />
                <span>Select All</span>
                <button
                  className={styles.deleteSelectedButton}
                  onClick={handleRemoveFromFavorite}
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
        {favorites.map((item) => (
          <div key={item._id} className={styles.gridItem} onClick={() => handleMovieClick(item.movie._id)}>
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
            </div>
            <h3 className={styles.movieTitle}>{item.movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchLater;
