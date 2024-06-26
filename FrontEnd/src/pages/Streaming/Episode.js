import React from 'react';
import styles from './Streaming.module.css';

const Episode = ({ episodes, episodeImages }) => {
  return (
    <div className={styles.episodesSection}>
      <h2>Episodes</h2>
      {episodes.map((episode, index) => (
        <div key={index} className={styles.episode}>
          <img src={episodeImages[index]?.image_url || 'https://via.placeholder.com/150'} alt={episode.title} className={styles.episodeImage} />
          <div className={styles.episodeDetails}>
            <p className={styles.episodeTitle}>{episode.title} </p>
            <p className={styles.episodeDuration}>{episode.duration} mins</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Episode;
