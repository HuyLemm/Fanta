import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/Cookies';
import styles from './Favorite.module.css';
import Loading from '../../components/public/LoadingEffect/Loading';
import Notification, { notifyError } from '../../components/public/Notification/Notification';

const Favourite = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null); // State to manage active dropdown
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

  const handleRemoveFromFavorite = (movieId) => {
    // Logic to remove movie from favorites
  };

  const handleSimilarGenre = (genre) => {
    // Logic to show movies of similar genre
  };

  const toggleDropdown = (movieId) => {
    if (activeDropdown === movieId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(movieId);
    }
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
    <div className={styles.favoriteContainer}>
      <Notification />
      <h1>Your Favorite Movies</h1>
      {watchlist.length > 0 ? (
        watchlist.map((item) => (
          <div key={item._id} className={styles.movieRow}>
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
                <strong>Duration:</strong> {item.movie.duration} mins
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
                  onClick={() => handleRemoveFromFavorite(item.movie._id)}
                >
                  Remove from favorite
                </button>
                <button
                  className={styles.dropdownButton}
                  onClick={() => handleSimilarGenre(item.movie.genre)}
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
  );
};

export default Favourite;
