import React, { useEffect, useState, useRef } from 'react';
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
import Notification, { notifyError } from '../../components/public/Notification/Notification';

const Streaming = () => {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [episodeImages, setEpisodeImages] = useState({});
  const [castImages, setCastImages] = useState({});
  const [directorImages, setDirectorImages] = useState({});
  const [currentEpisode, setCurrentEpisode] = useState(() => {
    const savedEpisode = sessionStorage.getItem('currentEpisode');
    return savedEpisode ? parseInt(savedEpisode, 10) : (location.state?.episode || 0);
  });
  const [initialTime, setInitialTime] = useState(location.state?.time || null);
  const navigate = useNavigate();
  const token = getCookie('jwt');
  const isSwitchingEpisode = useRef(false);

  const getStreamingUrl = (movie) => {
    if (movie.type === 'movie') {
      return movie.streaming_url;
    } else if (movie.type === 'series' && movie.episodes && movie.episodes.length > 0) {
      return movie.episodes[currentEpisode].streaming_url;
    }
    return null;
  };

  const saveCurrentTime = async (videoId, currentTime, latestEpisode) => {
    try {
      console.log(`Saving current time: ${currentTime} and latest episode: ${latestEpisode} for movieId: ${videoId}`);
      const response = await fetch('http://localhost:5000/public/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoId, currentTime, latestEpisode }),
      });
      if (!response.ok) {
        throw new Error('Failed to save watch time');
      }
    } catch (err) {
      console.error('Failed to save watch time:', err);
    }
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
        await fetchCastAndDirectorImages(data.cast, data.director);
      } catch (error) {
        notifyError(error.message);
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
        const episodeImagesObject = data.reduce((acc, image, index) => {
          acc[index] = image;
          return acc;
        }, {});
        setEpisodeImages(episodeImagesObject);
      } catch (error) {
        console.log('Fetch episode images error:', error);
      }
    };

    const fetchInitialTime = async (movieId, episode) => {
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
        if (episode === data.latestEpisode - 1) {
          setInitialTime(data.currentTime || 0);
        } else {
          setInitialTime(0);
        }
      } catch (err) {
        console.error('Failed to load watch time:', err);
        setInitialTime(0);
      }
    };

    const fetchData = async () => {
      await fetchCurrentUser();
      await fetchMovie();
      await fetchEpisodeImages(id);
      if (!location.state) {
        await fetchInitialTime(id, currentEpisode);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, token, currentEpisode, location.state]);

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
    sessionStorage.setItem('currentEpisode', currentEpisode);
  }, [currentEpisode]);

  const handleEpisodeChange = async (index) => {
    console.log(`Changing to episode: ${index + 1}`);
    sessionStorage.setItem('hasReloaded', 'false');

    // Lưu tập mới và thời gian 0 ngay lập tức
    isSwitchingEpisode.current = true;
    await saveCurrentTime(id, 0, index + 1);
    setCurrentEpisode(index); // Đặt tập mới
    setInitialTime(0); // Đặt thời gian của tập mới về 0
    console.log(`New currentEpisode: ${index}, initialTime: 0`);
    setTimeout(() => {
      isSwitchingEpisode.current = false;
    }, 1); // Thời gian chờ tùy chỉnh để đảm bảo đã chuyển tập xong

  };

  useEffect(() => {
    console.log(`Streaming component updated: currentEpisode = ${currentEpisode}, initialTime = ${initialTime}`);
  }, [currentEpisode, initialTime]);

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
                    currentEpisode={currentEpisode}
                    setInitialTime={setInitialTime}
                    isSwitchingEpisode={isSwitchingEpisode}
                  />
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
            <Episode episodes={movie.episodes} episodeImages={episodeImages} setCurrentEpisode={handleEpisodeChange} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Streaming;
