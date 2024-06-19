import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MovieDetail.module.css';

const RecommendedMovies = ({ recommendedMovies, genreItemsRef, handleNextClick, handlePrevClick, handleWatchClickRecommended }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.recommendedSection}>
      <h2 className={styles.recommendedTitle}>Recommended Movies</h2>
      <div className={styles.recommendedList}>
        <button className={styles.prevRecommended} onClick={() => handlePrevClick(0)}>&lt;</button>
        <div className={styles.recommendedItems} ref={(el) => genreItemsRef.current[0] = el}>
          {recommendedMovies.length > 0 ? (
            recommendedMovies.map((recommendedMovie) => (
              <div key={recommendedMovie._id} className={styles.recommendedItem}>
                <div className={styles.recommendedImageContainer}>
                  <img src={recommendedMovie.poster_url} alt={recommendedMovie.title} />
                  <button className={styles.watchButton} onClick={() => handleWatchClickRecommended(recommendedMovie._id)}>Watch</button>
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
    </section>
  );
};

export default RecommendedMovies;
