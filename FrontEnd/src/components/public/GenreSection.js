import React, { useRef, useEffect, useState } from 'react';
import styles from '../../assets/styles/GenreSection.module.css';

const GenreSection = ({ title }) => {
  const genreItemsRef = useRef(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch genres and their movies from the backend
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:5000/public/get-genres-movie'); // Adjust the endpoint as necessary
        const data = await response.json();

        const sortedGenres = data.sort((a, b) => a.name.localeCompare(b.name));
        setGenres(sortedGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  let currentScrollPosition = 0;
  const scrollAmount = 200;

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
    <div className={styles.genreSectionsContainer}>
      {genres.length > 0 && genres.map((genre, index) => (
        <div key={index} className={styles.genreSection}>
          <h2>{genre.name + ' Movies'}</h2>
          <div className={styles.genreList}>
            <button className={styles.prevGenre} onClick={handlePrevClick}>&lt;</button>
            <div className={styles.genreItems} ref={genreItemsRef}>
              {genre.movies && genre.movies.map((movie, movieIndex) => (
                <div className={styles.item} key={movieIndex}>
                  <div className={styles.imageContainer}>
                    <img src={movie.poster_url} alt={movie.title} />
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
      ))}
    </div>
  );
};

export default GenreSection;
