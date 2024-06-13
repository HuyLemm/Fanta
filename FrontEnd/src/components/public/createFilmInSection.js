import React, { useEffect, useRef, useState } from 'react';
import styles from '../assets/styles/GenreSection.module.css';

const GenreSection = ({ title, genreId }) => {
  const [movies, setMovies] = useState([]);
  const genreItemsRef = useRef(null);
  let currentScrollPosition = 0;
  const scrollAmount = 200;

  useEffect(() => {
    // Function to fetch movies from the backend
    const fetchMovies = async () => {
      try {
        const response = await fetch(`/api/genres/${genreId}/movies`); // URL đến API của bạn
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovies(data); // Giả sử data là mảng các object chứa { posterUrl, title }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [genreId]);

  const handleNextClick = () => {
    const genreItems = genreItemsRef.current;
    const maxScrollLeft = genreItems.scrollWidth - genreItems.clientWidth;
    if (currentScrollPosition >= maxScrollLeft) {
      currentScrollPosition = 0;
    } else {
      currentScrollPosition += scrollAmount;
    }
    genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
  };

  const handlePrevClick = () => {
    const genreItems = genreItemsRef.current;
    if (currentScrollPosition <= 0) {
      currentScrollPosition = genreItems.scrollWidth - genreItems.clientWidth;
    } else {
      currentScrollPosition -= scrollAmount;
    }
    genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
  };

  return (
    <div className={styles.genreSection}>
      <h2>{title}</h2>
      <div className={styles.genreList}>
        <button className={styles.prevGenre} onClick={handlePrevClick}>&lt;</button>
        <div className={styles.genreItems} ref={genreItemsRef}>
          {movies.map((movie, index) => (
            <div className={styles.item} key={index}>
              <div className={styles.imageContainer}>
                <img src={movie.posterUrl} alt={movie.title} />
              </div>
              <div className={styles.content}>
                <div className={styles.title}>{movie.title}</div>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.nextGenre} onClick={handleNextClick}>&gt;</button>
      </div>
    </div>
  );
};

export default GenreSection;
