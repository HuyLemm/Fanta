import React from 'react';
import PropTypes from 'prop-types';
import styles from './Episode.module.css';

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = 0;
  return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const Episode = ({ episodes, episodeImages, setCurrentEpisode, type }) => {
  const handleEpisodeChange = (index) => {
    sessionStorage.setItem('hasReloaded', 'false');
    setCurrentEpisode(index);
  };

  return (
    <div className={styles.episodesSection}>
      <h2>{type === 'movie' ? 'Movie' : 'Episodes'}</h2>
      <div className={styles.episodesContainer}>
        {type === 'movie' ? (
          <div className={styles.episode}>
            <div className={styles.episodeImageContainer}>
              <img 
                src={episodes[0]?.image_url || 'https://via.placeholder.com/150'} 
                alt="Movie" 
                className={styles.episodeImage} 
              />
              <div className={styles.playButton}></div>
              <div className={styles.episodeDuration}>{formatDuration(episodes[0]?.duration || 0)}</div>
            </div>
            <div className={styles.episodeDetails}>
              <p className={styles.episodeNumber}>Movie</p>
              <p className={styles.episodeTitle}>{episodes[0]?.title || 'Movie Title'}</p>
            </div>  
          </div>
        ) : (
          episodes.map((episode, index) => (
            <div
              key={index}
              className={styles.episode}
              onClick={() => handleEpisodeChange(index)}
            >
              <div className={styles.episodeImageContainer}>
                <img 
                  src={episodeImages[index]?.image_url || 'https://via.placeholder.com/150'} 
                  alt={episode.title} 
                  className={styles.episodeImage} 
                />
                <div className={styles.playButton}></div>
                <div className={styles.episodeDuration}>{formatDuration(episode.duration)}</div>
              </div>
              <div className={styles.episodeDetails}>
                <p className={styles.episodeNumber}>Episode {index + 1}</p>
                <p className={styles.episodeTitle}>{episode.title}</p>
              </div>  
            </div>
          ))
        )}
      </div>
    </div>
  );
};

Episode.propTypes = {
  episodes: PropTypes.array.isRequired,
  episodeImages: PropTypes.object.isRequired,
  setCurrentEpisode: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default Episode;
