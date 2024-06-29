import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchResults.module.css';
import Footer from '../../components/public/Footer/Footer';
import Notification, { notifySuccess, notifyError, notifyWarning, notifyInfo } from '../../components/public/Notification/Notification';

const SearchResults = () => {
  const [movies, setMovies] = useState([]); // State to store search results
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

    if (query) {
      fetchSearchResults(); // Fetch search results if query exists
    }
  }, []);

  // Function to handle watch button click
  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={styles.searchResultsPage}>
      <Notification />
      <div className={styles.searchResultsContainer}>
        {/* Main content area */}
        <div className={styles.mainContent}>
          <div className={styles.overlay}></div>
          {/* Heading for search results */}
          <h2 className={styles.h2}>Search Results for: "{getQuery()}"</h2>
          <div className={styles.moviesGrid}>
            {movies.length > 0 ? (
              // Map through movies and display each movie item
              movies.map((movie) => (
                <div key={movie._id} className={styles.movieItem}>
                  {/* Container for movie image and watch button */}
                  <div className={styles.imageContainer}>
                    <img src={movie.poster_url} alt={movie.title} className={styles.moviePoster} />
                    <button className={styles.watchButton} onClick={() => handleWatchClick(movie._id)}>Watch</button>
                  </div>
                </div>
              ))
            ) : (
              <div>No movies found</div> // Display message if no movies are found
            )}
          </div>
        </div>
        <div className={styles.sidebar}></div>
      </div>
      <div className={styles.footerSection}>
        <Footer />
      </div>
    </div>
  );
};

export default SearchResults;
