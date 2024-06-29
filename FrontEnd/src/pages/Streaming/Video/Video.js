import React from 'react';
import PropTypes from 'prop-types';
import styles from './Video.module.css';
import Notification from '../../../components/public/Notification/Notification';

const Video = ({ url, type }) => {
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (type === 'youtube') {
    const videoId = getYouTubeId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}?vq=hd1080`; // Yêu cầu YouTube phát ở chất lượng cao nhất
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
      <Notification />
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
