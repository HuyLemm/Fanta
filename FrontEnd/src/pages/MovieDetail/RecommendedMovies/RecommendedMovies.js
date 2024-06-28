import React from 'react';
import styles from './RecommendedMovies.module.css';

const RecommendedMovies = ({ recommendedMovies, genreItemsRef, handleNextClick, handlePrevClick, handleWatchClickRecommended }) => {
  return (
    <section className={styles.recommendedSection}>
      <h2 className={styles.recommendedTitle}>Recommended Movies</h2>
      {/* Container for the list of recommended movies */}
      <div className={styles.recommendedList}>
        <button className={styles.prevRecommended} onClick={() => handlePrevClick(0)}>&lt;</button>
        <div className={styles.recommendedItems} ref={(el) => genreItemsRef.current[0] = el}>
          {recommendedMovies.length > 0 ? (
            // Map through recommended movies and display each movie item
            recommendedMovies.map((recommendedMovie) => (
              <div key={recommendedMovie._id} className={styles.recommendedItem}>
                {/* Container for movie image and watch button */}
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
            <div>No recommended movies found</div> // Display message if no recommended movies are found
          )}
        </div>
        <button className={styles.nextRecommended} onClick={() => handleNextClick(0)}>&gt;</button>
      </div>
    </section>
  );
};

export default RecommendedMovies;
