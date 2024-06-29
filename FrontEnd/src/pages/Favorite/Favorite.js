import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/Cookies';
import styles from './Favorite.module.css';
import Loading from '../../components/public/LoadingEffect/Loading';
import Notification, {notifyError, notifySuccess,notifyWarning,notifyInfo} from '../../components/public/Notification/Notification';

const Favourite = () => {
  const [watchlist, setWatchlist] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const token = getCookie('jwt'); // Get JWT token from cookies
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        // Fetch the user's watchlist from the server
        const response = await fetch('http://localhost:5000/user/get-favorite', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setWatchlist(data); // Update the state with fetched watchlist
      } catch (error) {
        notifyError(error.message); // Set error message if any
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchWatchlist();
  }, [token]);

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`); // Navigate to the movie detail page
  };

  if (loading) {
    return <div><Loading/></div>; // Show loading component while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if any
  }

  return (
    <div className={styles.favoriteContainer}>
    <Notification />
      <h1>Your Favorite Movies</h1>
      {watchlist.length > 0 ? (
        // Map through the watchlist and display each movie item
        watchlist.map(item => (
          <div key={item._id} className={styles.movieRow}>
            {/* Container for movie poster and watch button */}
            <div className={styles.posterContainer}>
              <img src={item.movie.poster_url} alt={item.movie.title} className={styles.poster} />
              <button className={styles.watchButton} onClick={() => handleWatchClick(item.movie._id)}>Watch</button>
            </div>
            {/* Container for movie information */}
            <div className={styles.movieInfo}>
              <h2 className={styles.title}>{item.movie.title}</h2>
              <p><strong>Genre:</strong> {item.movie.genre.join(', ')}</p>
              <p><strong>Duration:</strong> {item.movie.duration} mins</p>
              <p><strong>Description:</strong> {item.movie.brief_description}</p>
              <p>{item.movie.description}</p>
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
