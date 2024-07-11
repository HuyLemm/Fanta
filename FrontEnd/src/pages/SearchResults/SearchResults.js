import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchResults.module.css';
import Footer from '../../components/public/Footer/Footer';
import Notification, { notifyError } from '../../components/public/Notification/Notification';
import Loading from '../../components/public/LoadingEffect/Loading';

const SearchResults = () => {
  const [movies, setMovies] = useState([]); // State to store search results
  const [topRatedMovies, setTopRatedMovies] = useState([]); // State to store top rated movies
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to get query parameter from URL
  const getQuery = () => {
    return new URLSearchParams(window.location.search).get('query');
  };

  useEffect(() => {
    const query = getQuery(); // Get the search query from URL
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/search-movies?query=${query}`);
        const data = await response.json();
        setMovies(data); // Update state with fetched search results
      } catch (error) {
        notifyError('Error fetching search results:', error); // Log errors if any
      }
    };

    const fetchTopRatedMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-top-rated-movies`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTopRatedMovies(data);
      } catch (error) {
        notifyError('Error fetching top rated movies:', error);
      }
    };

    if (query) {
      fetchSearchResults(); // Fetch search results if query exists
    }
    fetchTopRatedMovies(); // Fetch top rated movies
  }, []);

  // Function to handle watch button click
  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={styles.searchResultsPage}>
      <Notification />
      <div className={styles.outerContainer}>
        <div className={styles.searchResultsContainer}>
          <div className={styles.mainContent}>
            <div className={styles.overlay}></div>
            <h2 className={styles.h2}>Search Results for: "{getQuery()}"</h2>
            <div className={styles.moviesGrid}>
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <div key={movie._id} className={styles.movieItem}>
                    <div className={styles.imageContainer}>
                      <img src={movie.poster_url} alt={movie.title} className={styles.moviePoster} />
                      <button className={styles.watchButton} onClick={() => handleWatchClick(movie._id)}>Watch</button>
                    </div>
                  </div>
                ))
              ) : (
                <div>No movies found</div>
              )}
            </div>
          </div>
          <div className={`${styles.sidebar} ${styles.background}`}>
            <h3 className={styles.topRatedHeader}>Trending Movies</h3>
            <ul className={styles.topRatedList}>
              {topRatedMovies.map(movie => (
                <li key={movie._id} className={styles.topRatedItem}>
                  <div className={styles.topRatedMovie}>
                    <img src={movie.poster_url} alt={movie.title} className={styles.topRatedPoster} />
                    <div className={styles.topRatedDetails}>
                      <p>{movie.title}</p>
                      <p> ♥ {movie.averageRating.toFixed(1)}/5.0</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
