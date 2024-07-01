import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Video.module.css';
import { getCookie } from '../../../utils/Cookies';

const Video = ({ url, type, videoId, initialTime }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const saveCurrentTime = useCallback(async (currentTime) => {
    try {
      console.log(`Saving current time: ${currentTime} for videoId: ${videoId}`);
      const response = await fetch('http://localhost:5000/public/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('jwt')}`
        },
        body: JSON.stringify({ videoId, currentTime }),
      });
      if (!response.ok) {
        throw new Error('Failed to save watch time');
      }
    } catch (err) {
      console.error('Failed to save watch time:', err);
    }
  }, [videoId]);

  useEffect(() => {
    const setInitialTime = () => {
      if (initialTime !== null) {
        console.log(`Setting initial time: ${initialTime} for type: ${type}`);
        if (type === 'youtube' && playerRef.current) {
          playerRef.current.seekTo(initialTime);
        } else if (videoRef.current) {
          videoRef.current.currentTime = initialTime;
        }
      }
    };

    setInitialTime();

    const handleBeforeUnload = () => {
      if (type === 'youtube' && playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        console.log(`Before unload - current time: ${currentTime}`);
        saveCurrentTime(currentTime);
      } else if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        console.log(`Before unload - current time: ${currentTime}`);
        saveCurrentTime(currentTime);
      }
    };

    const handlePause = () => {
      if (type === 'youtube' && playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        console.log(`Pause - current time: ${currentTime}`);
        saveCurrentTime(currentTime);
      } else if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        console.log(`Pause - current time: ${currentTime}`);
        saveCurrentTime(currentTime);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (type === 'youtube' && playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          console.log(`Visibility change (hidden) - current time: ${currentTime}`);
          saveCurrentTime(currentTime);
        } else if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          console.log(`Visibility change (hidden) - current time: ${currentTime}`);
          saveCurrentTime(currentTime);
        }
      }
    };

    const videoNode = videoRef.current;
    const playerNode = playerRef.current;

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (videoNode) {
      videoNode.addEventListener('pause', handlePause);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (videoNode) {
        videoNode.removeEventListener('pause', handlePause);
      }
      handleBeforeUnload(); // Save the time when component unmounts
    };
  }, [initialTime, saveCurrentTime, type]);

  useEffect(() => {
    if (type === 'youtube') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player(videoRef.current, {
          events: {
            onReady: (event) => {
              console.log(`YouTube player ready, setting initial time: ${initialTime}`);
              event.target.seekTo(initialTime || 0);
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                const currentTime = event.target.getCurrentTime();
                console.log(`YouTube state change - current time: ${currentTime}`);
                saveCurrentTime(currentTime);
              }
            },
          },
        });
      };
    }
  }, [type, initialTime, saveCurrentTime]);

  if (type === 'youtube') {
    const getYouTubeId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYouTubeId(url);
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&vq=hd1080`;
    return (
      <div className={styles.videoContainer}>
        <iframe
          ref={videoRef}
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
      <video ref={videoRef} className={styles.streamingVideo} controls>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

Video.propTypes = {
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  initialTime: PropTypes.number, // Thêm initialTime để định nghĩa thời gian bắt đầu
};

export default Video;
