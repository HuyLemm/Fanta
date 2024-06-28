import React from 'react';
import PropTypes from 'prop-types';
import styles from './Video.module.css';

const Video = ({ url, type }) => {
  if (type === 'youtube') {
    const videoId = url.split('v=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
      <div className={styles.videoContainer}>
        <iframe
          className={styles.streamingVideo}
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        ></iframe>
      </div>
    );
  }

  return (
    <div className={styles.videoContainer}>
      <video className={styles.streamingVideo} controls>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

Video.propTypes = {
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Video;
