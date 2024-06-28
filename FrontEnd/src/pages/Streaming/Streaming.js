import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Streaming.module.css';
import { getCookie } from '../../utils/Cookies';
import Loading from '../../components/public/LoadingEffect/Loading';
import Video from './Video/Video';

import Episode from './Episode/Episode';
import RatingsDescription from './Rating/RatingsDescription';
import People from './People/People';
import Comments from './Comment/Comments';
import Footer from '../../components/public/Footer/Footer';

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
  const navigate = useNavigate();
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
      } catch (error) {
        console.error('Error fetching current user:', error);
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
        fetchCastAndDirectorImages(data.cast, data.director);
      } catch (error) {
        setError(error.message);
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
      } catch (error) {
        console.error('Fetch images error:', error);
      }
    };

    const fetchEpisodeImages = async (movieId) => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-tmdb-episode-images/${movieId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setEpisodeImages(data);
      } catch (error) {
        console.error('Fetch episode images error:', error);
      }
    };

    fetchCurrentUser();
    fetchMovie();
    fetchEpisodeImages(id);
  }, [id, token]);

  if (loading) {
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

  return (
    <div>
      <div className={styles.background}>
        <div className={styles.overlay}></div>
        <div className={styles.streamingContainer}>
          <div className={styles.contentWrapper}>
            <div className={styles.mainContent}>
              <div className={styles.videoSection}>
                {streamingUrl ? (
                  <Video url={streamingUrl} type={videoType} />
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
