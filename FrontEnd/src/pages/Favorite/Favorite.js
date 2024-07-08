import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/Cookies';
import styles from './Favorite.module.css';
import Loading from '../../components/public/LoadingEffect/Loading';
import Notification, { notifyError, notifySuccess } from '../../components/public/Notification/Notification';
import { calculateAverageDuration } from '../../utils/Function';

const Favourite = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null); // State to manage active dropdown
  const [isFiltered, setIsFiltered] = useState(false); // State to track if the list is filtered
  const [isSelecting, setIsSelecting] = useState(false); // State to track if the user is in selecting mode
  const token = getCookie('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch('http://localhost:5000/user/get-favorite', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setWatchlist(data);
        setDisplayList(data);
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [token]);

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemoveFromFavorite = async (movieIds) => {
    try {
      const response = await fetch('http://localhost:5000/user/remove-from-favorite', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId: movieIds })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const updatedWatchlist = watchlist.filter(item => !movieIds.includes(item.movie._id));
      setWatchlist(updatedWatchlist);
      setDisplayList(updatedWatchlist);
      notifySuccess('Removed selected movies from your favorite successfully!');
    } catch (error) {
      notifyError(error.message);
    }
  };

  const handleSimilarGenre = (genre) => {
    const similarMovies = watchlist.filter(item => item.movie.genre.includes(genre));
    setDisplayList(similarMovies);
    setIsFiltered(true);
  };

  const handleShowAll = () => {
    setDisplayList(watchlist);
    setIsFiltered(false);
  };

  const toggleDropdown = (movieId) => {
    if (activeDropdown === movieId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(movieId);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allMovieIds = watchlist.map(item => item.movie._id);
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

  const handleDeleteSelected = async () => {
    await handleRemoveFromFavorite(selectedMovies);
    setSelectedMovies([]);
  };

  const toggleSelectMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedMovies([]);
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.body}>
      <div className={`${styles.favoriteContainer} ${isSelecting ? styles.selecting : ''}`}>
        <Notification />
        <div className={styles.fixedHeader}>
          {isFiltered && (
            <button className={styles.showAllButton} onClick={handleShowAll}>Show All</button>
          )}
          <h1 className={styles.h2}>Your Favorite Movies</h1>
          <div className={styles.buttonGroup}>
            {isSelecting && (
              <>
                <input
                  type="checkbox"
                  className={styles.checkboxAll}
                  onChange={handleSelectAll}
                  checked={selectedMovies.length === watchlist.length}
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
        <div className={styles.scrollableContent}>
          {displayList.length > 0 ? (
            displayList.map((item) => (
              <div key={item._id} className={styles.movieRow}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    onChange={() => handleSelectMovie(item.movie._id)}
                    checked={selectedMovies.includes(item.movie._id)}
                  />
                </div>
                <div className={styles.posterContainer}>
                  <img
                    src={item.movie.poster_url}
                    alt={item.movie.title}
                    className={styles.poster}
                  />
                  <button
                    className={styles.watchButton}
                    onClick={() => handleWatchClick(item.movie._id)}
                  >
                    Watch
                  </button>
                </div>
                <div className={styles.movieInfo}>
                  <h2 className={styles.title}>{item.movie.title}</h2>
                  <p>
                    <strong>Genre:</strong> {item.movie.genre.join(', ')}
                  </p>
                  <p>
                    <strong>Duration:</strong> {item.movie.type === 'movie' ? `${item.movie.duration} mins` : `${calculateAverageDuration(item.movie.episodes)} mins/episode`}
                  </p>
                  <p>
                    <strong>Release:</strong> {new Date(item.movie.release_date).getFullYear()}
                  </p>
                  <p>
                    <strong>Director:</strong> {item.movie.director.join(', ')}
                  </p>
                  <p>
                    <strong>Cast:</strong> {item.movie.cast.join(', ')}
                  </p>
                  <p>{item.movie.description}</p>
                </div>
                <button className={styles.editButton} onClick={() => toggleDropdown(item._id)}>Edit</button>
                {activeDropdown === item._id && (
                  <div className={styles.dropdown}>
                    <button
                      className={styles.dropdownButton}
                      onClick={() => handleRemoveFromFavorite([item.movie._id])}
                    >
                      Remove from favorite
                    </button>
                    <button
                      className={styles.dropdownButton}
                      onClick={() => handleSimilarGenre(item.movie.genre[0])}
                    >
                      Similar genre
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No movies in your watchlist</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favourite;
