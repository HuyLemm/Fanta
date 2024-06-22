import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MainContent from './MainContent';
import RecommendedMovies from './RecommendedMovies';
import styles from './MovieDetail.module.css';
import { useNavigate } from 'react-router-dom';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const genreItemsRef = useRef([]);
  const navigate = useNavigate();

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

  const handleWatchClickRecommended = (movieId) => {
    navigate(`/movie/${movieId}`);
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

  return (
    <div className={styles.movieDetailContainer}>
      <MainContent movie={movie} handleWatchClick={handleWatchClick} />
      <RecommendedMovies
        recommendedMovies={recommendedMovies}
        genreItemsRef={genreItemsRef}
        handleNextClick={handleNextClick}
        handlePrevClick={handlePrevClick}
        handleWatchClickRecommended={handleWatchClickRecommended}
      />
    </div>
  );
};

export default MovieDetail;
