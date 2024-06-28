import React from 'react';
import styles from './Episode.module.css';

const Episode = ({ episodes, episodeImages }) => {
  return (
    // Episode section
    <div className={styles.episodesSection}>
      <h2>Episodes</h2> {/* Tiêu đề */}
      <div className={styles.episodesContainer}>
        {episodes.map((episode, index) => (
          <div key={index} className={styles.episode}>
            <img 
              src={episodeImages[index]?.image_url || 'https://via.placeholder.com/150'} 
              alt={episode.title} 
              className={styles.episodeImage} 
            /> {/* Hình ảnh của tập phim */}
            <div className={styles.episodeDetails}>
              <p className={styles.episodeTitle}>{episode.title}</p> {/* Tiêu đề tập phim */}
              <p className={styles.episodeDuration}>{episode.duration} mins</p> {/* Thời lượng tập phim */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Episode;
