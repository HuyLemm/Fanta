import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Streaming.module.css';
import { getCookie } from '../../utils/Cookies';
import Loading from '../../components/public/LoadingEffect/Loading';

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
  const navigate = useNavigate();
  const token = getCookie('jwt');

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

  return (
<<<<<<< HEAD
    <div className={styles.streamingContainer}> {/*Trang streaming*/}
      <div className={styles.contentWrapper}> 
        <div className={styles.mainContent}>
          <div className={styles.videoSection}>
            <video className={styles.streamingVideo} controls> {/*Streaming box */}
              <source src={movie.streaming_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className={styles.header}> {/*title */}
            <h1 className = {styles.movieTitle}>{movie.title}</h1>
            <div className={styles.epTitle}> &gt; EPISODE 1</div>
          </div>
          <RatingsDescription movie={movie} id={id} currentUser={currentUser} /> {/*Rating và description */}
          <People 
            movie={movie} 
            castImages={castImages} 
            directorImages={directorImages} 
          /> {/*Cast và Director */}
          <Comments 
            movieId={id} 
            currentUser={currentUser} 
          />
        </div> {/*Comment section */}
        <Episode episodes={movie.episodes} episodeImages={episodeImages} /> {/*Đặt theo bố cục nằm bên phải toàn bộ trang */}
=======
    <div className={styles.background}>
      <div className={styles.streamingContainer}>
        
        <div className={styles.contentWrapper}>
          <div className={styles.mainContent}>
            <div className={styles.videoSection}>
              <video className={styles.streamingVideo} controls>
                <source src={movie.streaming_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className={styles.header}>
              <h1 className = {styles.movieTitle}>{movie.title}</h1>
              <div className={styles.epTitle}> &gt; EPISODE 1</div>
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
          <Episode episodes={movie.episodes} episodeImages={episodeImages} />
        </div>
>>>>>>> 3698fa2e75ea657d8afe0f4cb7f924617393bc26
      </div>
      <Footer />
    </div>
  );
};

export default Streaming;
