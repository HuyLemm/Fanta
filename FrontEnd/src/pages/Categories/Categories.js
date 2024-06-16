import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Categories.module.css';

const GenreMovies = () => {
  const { genreName } = useParams();
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-movies-by-genre?genre=${genreName}`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    if (genreName) {
      fetchGenreMovies();
    }
  }, [genreName]);

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={styles.genreMoviesContainer}>
      <h2>Movies in {genreName}</h2>
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
          <div>No movies found in this genre</div>
        )}
      </div>
    </div>
  );
};

export default GenreMovies;
