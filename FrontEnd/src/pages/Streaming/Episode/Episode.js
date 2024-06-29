import React from 'react';
import PropTypes from 'prop-types';
import styles from './Episode.module.css';
import Notification from '../../../components/public/Notification/Notification';

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = 0;
  return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const Episode = ({ episodes, episodeImages, setCurrentEpisode }) => {
  return (
    <div className={styles.episodesSection}>
      <Notification />
      <h2>Episodes</h2> {/* Tiêu đề */}
      <div className={styles.episodesContainer}>
        {episodes.map((episode, index) => (
          <div
            key={index}
            className={styles.episode}
            onClick={() => setCurrentEpisode(index)}
          >
            <div className={styles.episodeImageContainer}>
              <img 
                src={episodeImages[index]?.image_url || 'https://via.placeholder.com/150'} 
                alt={episode.title} 
                className={styles.episodeImage} 
              /> {/* Hình ảnh của tập phim */}
              <div className={styles.playButton}></div>
              <div className={styles.episodeDuration}>{formatDuration(episode.duration)}</div> {/* Thời lượng tập phim */}
            </div>
            <div className={styles.episodeDetails}>
              <p className={styles.episodeNumber}>Episode {index + 1}</p> {/* Số tập phim */}
              <p className={styles.episodeTitle}>{episode.title}</p> {/* Tiêu đề tập phim */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Episode.propTypes = {
  episodes: PropTypes.array.isRequired,
  episodeImages: PropTypes.object.isRequired,
  setCurrentEpisode: PropTypes.func.isRequired,
};

export default Episode;
