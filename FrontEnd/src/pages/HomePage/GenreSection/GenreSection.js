import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GenreSection.module.css';
import { notifySuccess, notifyError, notifyWarning, notifyInfo } from '../../../components/public/Notification/Notification';
const GenreSection = ({ type }) => {
  const genreItemsRef = useRef([]); 
  const [genres, setGenres] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-genres-movie?type=${type || ''}`);
        const data = await response.json();

        // Sort genres by the number of movies in descending order
        const sortedGenres = data.sort((a, b) => b.movies.length - a.movies.length);

        // Take the top 4 genres
        const topGenres = sortedGenres.slice(0, 4);

        setGenres(topGenres);
      } catch (error) {
        notifyError('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [type]);

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

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`); // Navigate to the movie detail page
  };

  return (
    <div className={styles.genreSectionsContainer}>
      {genres.length > 0 && genres.map((genre, index) => (
        <div key={index} className={styles.genreSection}>
          <h2>{genre.name + (type === 'series' ? ' Series' : ' Movies')}</h2> {/* Updated title logic */}
          {/* Container for genre items */}
          <div className={styles.genreList}>
            {/* Previous button */}
            <button className={styles.prevGenre} onClick={() => handlePrevClick(index)}>&lt;</button>
            {/* Scrollable list of movies */}
            <div className={styles.genreItems} ref={(el) => genreItemsRef.current[index] = el}>
              {genre.movies && genre.movies.map((movie, movieIndex) => (
                <div className={styles.item} key={movieIndex}>
                  {/* Container for movie image and watch button */}
                  <div className={styles.imageContainer}>
                    <img src={movie.poster_url} alt={movie.title} />
                    <button className={styles.watchButton} onClick={() => handleWatchClick(movie._id)}>Watch</button>
                  </div>
                  {/* Movie title */}
                  <div className={styles.content}>
                    <div className={styles.title}>{movie.title}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Next button */}
            <button className={styles.nextGenre} onClick={() => handleNextClick(index)}>&gt;</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenreSection;