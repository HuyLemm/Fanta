import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Categories.module.css';
import Footer from '../../components/public/Footer/Footer';

const GenreMovies = () => {
  const { genreName } = useParams(); 
  const [movies, setMovies] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        // Fetch movies of the selected genre from the server
        const response = await fetch(`http://localhost:5000/public/get-movies-by-genre?genre=${genreName}`);
        const data = await response.json();
        setMovies(data); // Update the state with fetched movies
      } catch (error) {
        console.error('Error fetching movies:', error); // Log errors if any
      }
    };

    if (genreName) {
      fetchGenreMovies(); // Fetch movies if genre name is available
    }
  }, [genreName]);

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`); // Navigate to the movie detail page
  };

  return (
    <div className={styles.genreMoviesPage}>
      {/* Main container for genre movies page */}
      <div className={styles.genreMoviesContainer}>
        <div className={styles.mainContent}>
          <div className={styles.overlay}></div>
          <h2 className={styles.h2}>Movies in {genreName}</h2>
          <div className={styles.moviesGrid}>
            {movies.length > 0 ? (
              // Map through the movies and display each movie item
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
              <div>No movies found in this genre</div> 
            )}
          </div>
        </div>
        <div className={styles.sidebar}></div>
      </div>
      {/* Footer section */}
      <div className={styles.footerSection}>
        <Footer />
      </div>
    </div>
  );
};

export default GenreMovies;
