import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainContent from './MainContent/MainContent';
import RecommendedMovies from './RecommendedMovies/RecommendedMovies';
import styles from './MovieDetail.module.css';
import Footer from '../../components/public/Footer/Footer';
import Loading from '../../components/public/LoadingEffect/Loading';
import Notification, { notifySuccess, notifyError, notifyWarning, notifyInfo } from '../../components/public/Notification/Notification';

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
        const response = await fetch(`http://localhost:5000/public/get-movie-by-id/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setMovie(data);
        fetchRecommendedMovies(data.genre, id); // Fetch recommended movies based on genre
      } catch (error) {
        notifyError('Fetch movie error:', error);
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
        setRecommendedMovies(data); // Update state with recommended movies
      } catch (error) {
        notifyError('Fetch recommended movies error:', error);
      }
    };

    fetchMovie();
  }, [id]);

  // Function to handle watch button click
  const handleWatchClick = () => {
    navigate(`/streaming/${id}`);
  };

  // Function to handle watch button click for recommended movies
  const handleWatchClickRecommended = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const scrollAmount = 200; // Amount to scroll on button click

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
    return <div><Loading /></div>; 
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  if (!movie) {
    return <div>No movie data found</div>; 
  }

  return (
    <div className={styles.movieDetailContainer}>
      <Notification />
      {/* Main content section for movie details */}
      <MainContent movie={movie} handleWatchClick={handleWatchClick} />
      {/* Section for recommended movies */}
      <RecommendedMovies
        recommendedMovies={recommendedMovies}
        genreItemsRef={genreItemsRef}
        handleNextClick={handleNextClick}
        handlePrevClick={handlePrevClick}
        handleWatchClickRecommended={handleWatchClickRecommended}
      />
      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default MovieDetail;
