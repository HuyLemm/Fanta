import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import styles from './MovieDetail.module.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const navigate = useNavigate();
  const genreItemsRef = useRef([]);

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
        fetchRecommendedMovies(data.genre, id);
      } catch (error) {
        console.error('Fetch movie error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }

      if (!sessionStorage.getItem('isRefreshed')) {
        sessionStorage.setItem('isRefreshed', 'true');
        window.location.reload();
      } else {
        sessionStorage.removeItem('isRefreshed');
      }
    };

    const fetchRecommendedMovies = async (genres, currentMovieId) => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-recommended-movies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ genres, currentMovieId })
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Recommended movies:', data);
        setRecommendedMovies(data);
      } catch (error) {
        console.error('Fetch recommended movies error:', error);
      }
    };

    fetchMovie();
  }, [id]);

  const handleWatchClick = () => {
    navigate(`/streaming/${id}`);
  };

  const scrollAmount = 200;

  const handleNextClick = (index) => {
    const genreItems = genreItemsRef.current[index];
    if (genreItems) {
      const maxScrollLeft = genreItems.scrollWidth - genreItems.clientWidth;
      let currentScrollPosition = genreItems.scrollLeft;
      if (currentScrollPosition >= maxScrollLeft) {
        currentScrollPosition = 0;
      } else {
        currentScrollPosition += scrollAmount;
      }
      genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
    }
  };

  const handlePrevClick = (index) => {
    const genreItems = genreItemsRef.current[index];
    if (genreItems) {
      let currentScrollPosition = genreItems.scrollLeft;
      if (currentScrollPosition <= 0) {
        currentScrollPosition = genreItems.scrollWidth - genreItems.clientWidth;
      } else {
        currentScrollPosition -= scrollAmount;
      }
      genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>No movie data found</div>;
  }

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const trailerId = getYouTubeId(movie.trailer_url);

  return (
    <div className={styles.movieDetailContainer}>
      <div className={styles.background} style={{ backgroundImage: `url(${movie.background_url})` }}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <img src={movie.poster_url} alt={movie.title} className={styles.poster} />
          <div className={styles.details}>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.meta}>
              <span className={styles.rating}>{movie.rating}</span>
              <span className={styles.quality}>HD</span>
              <span className={styles.genres}>{movie.genre.join(', ')}</span>
              <span className={styles.releaseDate}>{new Date(movie.release_date).getFullYear()}</span>
              <span className={styles.duration}>{movie.duration} min</span>
            </p>
            <p className={styles.director}><strong className={styles.dir}>Director:</strong> {movie.director.join(', ')}</p>
            <p className={styles.cast}><strong className={styles.dir}>Cast: </strong>{movie.cast.join(', ')}</p>
            <p className={styles.description}>{movie.description}</p>
            <button className={styles.watchNowButton} onClick={handleWatchClick}>Watch Now</button>
          </div>
        </div>
      </div>

      <span className={styles.trailerSection}>
        {trailerId ? (
          <YouTube videoId={trailerId} opts={{ width: '33%', height: '400px' }} />
        ) : (
          <div>Trailer not available</div>
        )}
      </span>

      <div className={styles.recommendedSection}>
        <h2 className={styles.recommendedTitle}>Recommended Movies</h2>
        <div className={styles.recommendedList}>
          <button className={styles.prevRecommended} onClick={() => handlePrevClick(0)}>&lt;</button>
          <div className={styles.recommendedItems} ref={(el) => genreItemsRef.current[0] = el}>
            {recommendedMovies.length > 0 ? (
              recommendedMovies.map((recommendedMovie) => (
                <div key={recommendedMovie._id} className={styles.recommendedItem}>
                  <div className={styles.recommendedImageContainer}>
                    <img src={recommendedMovie.poster_url} alt={recommendedMovie.title} />
                    <button className={styles.watchButton} onClick={() => handleWatchClick(recommendedMovie._id)}>Watch</button>
                  </div>
                  <div className={styles.recommendedContent}>
                    <div className={styles.recommendedItemTitle}>{recommendedMovie.title}</div>
                  </div>
                </div>
              ))
            ) : (
              <div>No recommended movies found</div>
            )}
          </div>
          <button className={styles.nextRecommended} onClick={() => handleNextClick(0)}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
