import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Video.module.css';
import { getCookie } from '../../../utils/Cookies';

const Video = ({ url, type, videoId, initialTime, currentEpisode, setInitialTime, isSwitchingEpisode }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const saveCurrentTime = useCallback(async (currentTime, episode) => {
    if (!videoId) return;
    try {
      const latestEpisode = episode + 1;
      console.log(`Saving current time: ${currentTime} and latest episode: ${latestEpisode} for videoId: ${videoId}`);
      const response = await fetch('http://localhost:5000/public/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('jwt')}`
        },
        body: JSON.stringify({ videoId, currentTime, latestEpisode }),
      });
      if (!response.ok) {
        throw new Error('Failed to save watch time');
      }
    } catch (err) {
      console.error('Failed to save watch time:', err);
    }
  }, [videoId]);

  useEffect(() => {
    const setInitialTimeInPlayer = () => {
      console.log(`Setting initial time: ${initialTime} for type: ${type}, currentEpisode: ${currentEpisode}`);
      if (initialTime !== null && isPlayerReady) {
        if (type === 'youtube' && playerRef.current) {
          playerRef.current.seekTo(initialTime);
        } else if (videoRef.current) {
          videoRef.current.currentTime = initialTime;
        }
      }
    };

    setInitialTimeInPlayer();
    
    const handlePause = async() => {
      if (!videoId) return;
      let currentTime = 0;

      if (type === 'youtube' && playerRef.current) {
        currentTime = playerRef.current.getCurrentTime();
      } else if (videoRef.current) {
        currentTime = videoRef.current.currentTime;
      }

      console.log(`Before pause - current time: ${currentTime}`);
      await saveCurrentTime(currentTime, currentEpisode);
    };

    const handleBeforeUnload = async () => {
      if (!videoId) return;
      let currentTime = 0;

      if (type === 'youtube' && playerRef.current) {
        currentTime = playerRef.current.getCurrentTime();
      } else if (videoRef.current) {
        currentTime = videoRef.current.currentTime;
      }

      console.log(`Before unload - current time: ${currentTime}`);
      await saveCurrentTime(currentTime, currentEpisode);
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        if (!videoId) return;
        let currentTime = 0;

        if (type === 'youtube' && playerRef.current) {
          currentTime = playerRef.current.getCurrentTime();
        } else if (videoRef.current) {
          currentTime = videoRef.current.currentTime;
        }

        console.log(`Visibility change (hidden) - current time: ${currentTime}`);
        await saveCurrentTime(currentTime, currentEpisode);
      }
    };

    if (videoId) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      if (videoRef.current) {
        videoRef.current.addEventListener('pause', handlePause);
      }
    }

    return () => {
      if (videoId) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (videoRef.current) {
          videoRef.current.removeEventListener('pause', handlePause);
        }
      }
    };
  }, [initialTime, saveCurrentTime, type, currentEpisode, setInitialTime, videoId, isSwitchingEpisode, isPlayerReady]);

  useEffect(() => {
    if (type === 'youtube') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player(videoRef.current, {
          events: {
            onReady: (event) => {
              console.log(`YouTube player ready, setting initial time: ${initialTime}`);
              setIsPlayerReady(true);
              event.target.seekTo(initialTime);
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                const currentTime = event.target.getCurrentTime();
                console.log(`YouTube state change - current time: ${currentTime}`);
                saveCurrentTime(currentTime, currentEpisode);
              }
            },
          },
        });
      };
    }
  }, [type, initialTime, saveCurrentTime, url, currentEpisode]);

  useEffect(() => {
    console.log(`Video component updated: initialTime = ${initialTime}, currentEpisode = ${currentEpisode}`);
    if (videoRef.current && type !== 'youtube') {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime, currentEpisode, type, isPlayerReady]);

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
  initialTime: PropTypes.number,
  currentEpisode: PropTypes.number,
  setInitialTime: PropTypes.func.isRequired,
  isSwitchingEpisode: PropTypes.bool.isRequired,
};

export default Video;
