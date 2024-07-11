import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Categories.module.css';
import Footer from '../../components/public/Footer/Footer';
import Notification, { notifyError } from '../../components/public/Notification/Notification';
import Loading from '../../components/public/LoadingEffect/Loading';

const GenreMovies = () => {
  const { genreName } = useParams();
  const [movies, setMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 25;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-movies-by-genre?genre=${genreName}`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        notifyError('Error fetching movies:', error);
      }
    };

    const fetchTopRatedMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-top-rated-movies-by-genre?genre=${genreName}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTopRatedMovies(data); // Chuyển đổi cấu trúc dữ liệu cho phù hợp
      } catch (error) {
        notifyError('Error fetching top rated movies:', error);
      }
    };

    if (genreName) {
      fetchGenreMovies();
      fetchTopRatedMovies();
    }
  }, [genreName]);

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(movies.length / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.genreMoviesPage}>
      <Notification />
      <div className={styles.outerContainer}>
        <div className={styles.genreMoviesContainer}>
          <div className={styles.mainContent}>
            <div className={styles.overlay}></div>
            <h2 className={styles.h2}>Movies in {genreName}</h2>
            <div className={styles.moviesGrid}>
              {currentMovies.length > 0 ? (
                currentMovies.map((movie) => (
                  <div key={movie._id} className={styles.movieItem}>
                    <div className={styles.imageContainer}>
                      <img src={movie.poster_url} alt={movie.title} className={styles.moviePoster} />
                      <button className={styles.watchButton} onClick={() => handleWatchClick(movie._id)}>Watch</button>
                    </div>
                  </div>
                ))
              ) : (
                <div><Loading /></div>
              )}
            </div>
            <div className={styles.pagination}>
              {pageNumbers.map(number => (
                <button key={number} onClick={() => handleClick(number)} className={styles.pageButton}>
                  {number}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.sidebar}>
              <h3 className={styles.topRatedHeader}>Top 5 in {genreName}</h3>
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

export default GenreMovies;
