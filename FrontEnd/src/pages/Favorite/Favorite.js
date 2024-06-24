import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/Cookies';
import styles from './Favorite.module.css';

const Favourite = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch('http://localhost:5000/user/get-favorite', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setWatchlist(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [token]);

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.favoriteContainer}>
      <h1>Your Favorite Movies</h1>
      {watchlist.length > 0 ? (
        watchlist.map(item => (
          <div key={item._id} className={styles.movieRow}>
            <img src={item.movie.poster_url} alt={item.movie.title} className={styles.poster} />
            <div className={styles.movieInfo}>
              <h2>{item.movie.title}</h2>
              <p><strong>Director:</strong> {item.movie.director.join(', ')}</p>
              <p><strong>Cast:</strong> {item.movie.cast.join(', ')}</p>
              <p><strong>Genre:</strong> {item.movie.genre.join(', ')}</p>
              <p><strong>Release Date:</strong> {new Date(item.movie.release_date).toLocaleDateString()}</p>
              <p><strong>Duration:</strong> {item.movie.duration} min</p>
              <p>{item.movie.description}</p>
              <button onClick={() => handleWatchClick(item.movie._id)} className={styles.watchButton}>Watch</button>
            </div>
          </div>
        ))
      ) : (
        <div>No movies in your watchlist</div>
      )}
    </div>
  );
};

export default Favourite;