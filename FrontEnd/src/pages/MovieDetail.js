import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MovieDetail.module.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        console.log(`Fetching movie with ID: ${id}`);
        const response = await fetch(`http://localhost:5000/public/get-movie-by-id/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Movie data:', data);
        setMovie(data);
      } catch (error) {
        console.error('Fetch movie error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>No movie data found</div>;
  }

  return (
    <div className={styles.movieDetailContainer}>
      <div className={styles.background} style={{ backgroundImage: `url(${movie.background_url})` }}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.description}>{movie.description}</p>
          <p><strong>Duration:</strong> {movie.duration} minutes</p>
          <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
          <p><strong>Genre:</strong> {movie.genre.join(', ')}</p>
          <p><strong>Director:</strong> {movie.director.join(', ')}</p>
          <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
