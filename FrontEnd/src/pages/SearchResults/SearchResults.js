import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './SearchResults.module.css';

const SearchResults = () => {
  const [movies, setMovies] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
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
  }, [query]);

  return (
    <div className={styles.searchResultsContainer}>
      <h2>Search Results for: "{query}"</h2>
      <div className={styles.moviesGrid}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie._id} className={styles.movieItem}>
              <img src={movie.poster_url} alt={movie.title} className={styles.moviePoster} />
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
