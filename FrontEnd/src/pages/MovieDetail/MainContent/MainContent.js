import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import styles from './MainContent.module.css';
import { getCookie } from '../../../utils/Cookies';
import { capitalizeFirstLetter } from '../../../utils/Function';
import { notifyInfo, notifySuccess, notifyWarning, notifyError } from '../../../components/public/Notification/Notification';

const MainContent = ({ movie, handleWatchClick }) => {
  const [averageRating, setAverageRating] = useState(0); 
  const [numberOfRatings, setNumberOfRatings] = useState(0); 
  const [isFavourite, setIsFavourite] = useState(false); 
  const token = getCookie('jwt'); 
  useEffect(() => {
    // Fetch average rating of the movie
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-average-rating/${movie._id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setAverageRating(data.averageRating);
        setNumberOfRatings(data.numberOfRatings);
      } catch (error) {
        notifyError('Fetch average rating error:', error);
      }
    };

    // Check if the movie is in the user's favourite list
    const checkIfFavourite = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-watchlist/${movie._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setIsFavourite(data.isFavourite);
      } catch (error) {
        console.log('Check if favourite error:', error);
      }
    };

    fetchAverageRating();
    checkIfFavourite();
  }, [movie._id, token]);

  // Extract YouTube ID from the trailer URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const trailerId = getYouTubeId(movie.trailer_url);

  // Handle add to favourite button click
  const handleAddToFavourite = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/toggle-watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId: movie._id })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setIsFavourite(data.isFavourite);
      notifySuccess(data.message); // Notify success
    } catch (error) {
      notifyWarning('You need to log in first to add to favourite');
    }
  };

  // Calculate average duration for series
  const averageDuration = movie.type === 'series' && movie.episodes.length > 0
    ? Math.round(movie.episodes.reduce((total, episode) => total + episode.duration, 0) / movie.episodes.length)
    : null;

  return (
    <section className={styles.mainSection}>
      <div className={styles.background} style={{ backgroundImage: `url(${movie.background_url})` }}>
        <div className={styles.overlay}></div>
        {/* Content area */}
        <div className={styles.content}>
          <img src={movie.poster_url} alt={movie.title} className={styles.poster} />
          <div className={styles.details}>
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>{movie.title}</h1>
              <div className={styles.addToFavouriteContainer}>
                <button className={styles.addToFavouriteButton} onClick={handleAddToFavourite}>
                  <div className={isFavourite ? styles.bookmarkIconActive : styles.bookmarkIcon} />
                </button>
                <div className={styles.hoverBox}>
                  {isFavourite ? 'Remove from your favorite' : 'Add to favorite'}
                </div>
              </div>
            </div>
            {/* Meta information */}
            <p className={styles.meta}>
              <span className={styles.quality}>HD</span>
              <span className={styles.genres}>{movie.genre.join(', ')}</span>
              <span className={styles.releaseDate}>{new Date(movie.release_date).getFullYear()}</span>
              <span className={styles.releaseDate}>{capitalizeFirstLetter(movie.type)}</span>
              {movie.type === 'movie' ? (
                <span className={styles.duration}>{movie.duration} mins</span>
              ) : (
                <span className={styles.duration}>{averageDuration} mins/episode</span>
              )}
            </p>
            {/* Rating information */}
            <div>
              {numberOfRatings > 0 ? (
                <p className={styles.cast}><strong className={styles.dir}>Rating: </strong>{averageRating.toFixed(1)}/5.0 ({numberOfRatings} rated)</p>
              ) : (
                <p className={styles.cast}><strong className={styles.dir}>Rating: </strong>Unrated</p>
              )}
            </div>
            <p className={styles.director}><strong className={styles.dir}>Director:</strong> {movie.director.join(', ')}</p>
            <p className={styles.cast}><strong className={styles.dir}>Cast: </strong>{movie.cast.join(', ')}</p>
            <p className={styles.description}>{movie.brief_description}</p>
            <button className={styles.watchNowButton} onClick={handleWatchClick}>Watch Now</button>
          </div>
        </div>
      </div>
      {/* Trailer section */}
      <div className={styles.trailerSection}>
        {trailerId ? (
          <YouTube videoId={trailerId} opts={{ width: '150%', height: '250rem' }} />
        ) : (
          <div>Trailer not available</div>
        )}
      </div>
    </section>
  );
};

export default MainContent;
