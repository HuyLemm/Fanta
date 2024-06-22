import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchResults.module.css';
import Footer from '../../components/public/Footer/Footer';

const SearchResults = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const getQuery = () => {
    return new URLSearchParams(window.location.search).get('query');
  };

  useEffect(() => {
    const query = getQuery();
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/search-movies?query=${query}`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, []);

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={styles.searchResultsContainer}>
      <h2 className={styles.h}>Search Results for: "{getQuery()}"</h2>
      <div className={styles.moviesGrid}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie._id} className={styles.movieItem}>
              <div className={styles.imageContainer}>
                <img src={movie.poster_url} alt={movie.title} className={styles.moviePoster} />
                <button className={styles.watchButton} onClick={() => handleWatchClick(movie._id)}>Watch</button>
              </div>
              <div className={styles.movieTitle}>{movie.title}</div>
            </div>
          ))
        ) : (
          <div>No movies found</div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
