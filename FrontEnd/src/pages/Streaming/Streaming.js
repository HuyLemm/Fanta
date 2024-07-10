import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styles from './Streaming.module.css';
import { getCookie } from '../../utils/Cookies';
import Loading from '../../components/public/LoadingEffect/Loading';
import Video from './Video/Video';
import Episode from './Episode/Episode';
import RatingsDescription from './RatingsDescription/RatingsDescription';
import People from './People/People';
import Comments from './Comment/Comments';
import Footer from '../../components/public/Footer/Footer';
import Notification, { notifyError } from '../../components/public/Notification/Notification';

const Streaming = () => {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [initialEpisode, setInitialEpisode] = useState(() => {
    const savedEpisode = sessionStorage.getItem('currentEpisode');
    return savedEpisode ? parseInt(savedEpisode, 10) : (location.state?.episode || 0);
  });
  const [initialTime, setInitialTime] = useState(location.state?.time || 0);
  const token = getCookie('jwt');

  const getStreamingUrl = (movie) => {
    if (movie.type === 'movie') {
      return movie.streaming_url;
    } else if (movie.type === 'series' && movie.episodes && movie.episodes.length > 0) {
      return movie.episodes[initialEpisode].streaming_url;
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
      } catch (error) {
        notifyError(error.message);
      }
    };

    const fetchInitialTime = async (movieId) => {
      try {
        console.log('Fetching initial time for movieId:', movieId);
        const response = await fetch(`http://localhost:5000/public/get-history/${movieId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to load watch time');
        }
        const data = await response.json();
        console.log('Fetched initial time and episode:', data.currentTime, data.latestEpisode);
        if (data.latestEpisode && data.latestEpisode > 0) {
          setInitialEpisode(data.latestEpisode - 1);
          setInitialTime(data.currentTime || 0);
        } else {
          setInitialEpisode(0);
          setInitialTime(0);
        }
      } catch (err) {
        console.error('Failed to load watch time:', err);
        setInitialEpisode(0);
        setInitialTime(0);
      }
    };

    const fetchData = async () => {
      await fetchCurrentUser();
      await fetchMovie();
      if (!location.state) {
        await fetchInitialTime(id);
      } else {
        setInitialTime(location.state.time || 0);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, token, location.state]);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem('hasReloaded');
    console.log('Checking sessionStorage hasReloaded:', hasReloaded);
    if (hasReloaded === 'false' && initialTime !== null) {
      console.log('Reloading page...');
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload(); // Tự động khởi động lại trang
    }
  }, [initialTime]);

  if (loading || initialTime === null) {
    return <div><Loading /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>No movie data found</div>;
  }

  const streamingUrl = getStreamingUrl(movie);
  const videoType = streamingUrl && streamingUrl.includes('youtube') ? 'youtube' : 'mp4';
  const videoId = movie._id;

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
                  <Video
                    url={streamingUrl}
                    type={videoType}
                    videoId={videoId}
                    initialTime={initialTime}
                    currentEpisode={initialEpisode}
                    setInitialTime={setInitialTime}
                    isSwitchingEpisode={false}
                  />
                ) : (
                  <div>No video available</div>
                )}
              </div>
              <div className={styles.header}>
                <h1 className={styles.movieTitle}>{movie.title}</h1>
                {movie.type === 'series' && (
                  <div className={styles.epTitle}> &gt; EPISODE {initialEpisode + 1}</div>
                )}
              </div>
              <RatingsDescription movie={movie} id={id} currentUser={currentUser} />
              <People 
                movie={movie} 
              />
              <Comments 
                movieId={id} 
                currentUser={currentUser} 
              />
            </div>
            <Episode 
              movieId={movie._id} 
              episodes={movie.episodes} 
              type={movie.type} 
              initialEpisode={initialEpisode} 
              initialTime={initialTime} 
              genres={movie.genre}
              setInitialEpisode={setInitialEpisode}
              setInitialTime={setInitialTime}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Streaming;
