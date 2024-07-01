import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './Streaming.module.css';
import { getCookie } from '../../utils/Cookies';
import Loading from '../../components/public/LoadingEffect/Loading';
import Video from './Video/Video';

import Episode from './Episode/Episode';
import RatingsDescription from './RatingsDescription/RatingsDescription';
import People from './People/People';
import Comments from './Comment/Comments';
import Footer from '../../components/public/Footer/Footer';

import Notification, { notifyError, notifySuccess, notifyWarning, notifyInfo } from '../../components/public/Notification/Notification';

const Streaming = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [episodeImages, setEpisodeImages] = useState({});
  const [castImages, setCastImages] = useState({});
  const [directorImages, setDirectorImages] = useState({});
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [initialTime, setInitialTime] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getCookie('jwt');

  const getStreamingUrl = (movie) => {
    if (movie.type === 'movie') {
      return movie.streaming_url;
    } else if (movie.type === 'series' && movie.episodes && movie.episodes.length > 0) {
      return movie.episodes[currentEpisode].streaming_url;
    }
    return null;
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/public/get-current-user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setCurrentUser(data);
        console.log('Fetched current user:', data);
      } catch (error) {
        console.log('Error fetching current user:', error);
      }
    };

    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-movie-by-id/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setMovie(data);
        console.log('Fetched movie:', data);
        fetchCastAndDirectorImages(data.cast, data.director);
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCastAndDirectorImages = async (cast, director) => {
      try {
        const response = await fetch('http://localhost:5000/public/get-cast-and-director-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cast, director })
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setCastImages(data.castImages);
        setDirectorImages(data.directorImages);
        console.log('Fetched cast and director images:', data);
      } catch (error) {
        console.log('Fetch images error:', error);
      }
    };

    const fetchEpisodeImages = async (movieId) => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-tmdb-episode-images/${movieId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Chuyển đổi dữ liệu từ array thành object
        const episodeImagesObject = data.reduce((acc, image, index) => {
          acc[index] = image;
          return acc;
        }, {});
        setEpisodeImages(episodeImagesObject);
        console.log('Fetched episode images:', data);
      } catch (error) {
        console.log('Fetch episode images error:', error);
      }
    };

    const fetchInitialTime = async (videoId) => {
      try {
        console.log('Fetching initial time for videoId:', videoId);
        const response = await fetch(`http://localhost:5000/public/get-history/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to load watch time');
        }
        const data = await response.json();
        console.log('Fetched initial time:', data.currentTime);
        setInitialTime(data.currentTime || 0);
      } catch (err) {
        console.error('Failed to load watch time:', err);
        setInitialTime(0); // Set initialTime to 0 if there's an error
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchCurrentUser();
      await fetchMovie();
      await fetchEpisodeImages(id);
      await fetchInitialTime(id);
      setLoading(false);
    };

    fetchData();
  }, [id, token]);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem('hasReloaded');
    console.log('Checking sessionStorage hasReloaded:', hasReloaded);
    if (hasReloaded === 'false' && initialTime !== null) {
      console.log('Reloading page...');
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload(); // Tự động khởi động lại trang
    }
  }, [initialTime]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (location.pathname !== `/streaming/${id}`) {
        console.log('Removing sessionStorage hasReloaded');
        sessionStorage.removeItem('hasReloaded');
      }
    };

    window.addEventListener('beforeunload', handleRouteChange);
    return () => {
      window.removeEventListener('beforeunload', handleRouteChange);
      handleRouteChange();
    };
  }, [location.pathname, id]);

  if (loading || initialTime === null) {
    return <div><Loading/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>No movie data found</div>;
  }

  const streamingUrl = getStreamingUrl(movie);
  const videoType = streamingUrl && streamingUrl.includes('youtube') ? 'youtube' : 'mp4';
  const videoId = movie._id; // Đảm bảo rằng videoId được truyền đúng cách từ movie

  return (
    <div>
      <Notification />
      <div className={styles.background}>
        <div className={styles.overlay}></div>
        <div className={styles.streamingContainer}>
          <div className={styles.contentWrapper}>
            <div className={styles.mainContent}>
              <div className={styles.videoSection}>
                {streamingUrl ? (
                  <Video url={streamingUrl} type={videoType} videoId={videoId} initialTime={initialTime} />
                ) : (
                  <div>No video available</div>
                )}
              </div>
              <div className={styles.header}>
                <h1 className={styles.movieTitle}>{movie.title}</h1>
                {movie.type === 'series' && (
                  <div className={styles.epTitle}> &gt; EPISODE {currentEpisode + 1}</div>
                )}
              </div>
              <RatingsDescription movie={movie} id={id} currentUser={currentUser} />
              <People 
                movie={movie} 
                castImages={castImages} 
                directorImages={directorImages} 
              />
              <Comments 
                movieId={id} 
                currentUser={currentUser} 
              />
            </div>
            <Episode episodes={movie.episodes} episodeImages={episodeImages} setCurrentEpisode={setCurrentEpisode} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Streaming;
