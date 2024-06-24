import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import styles from './MovieDetail.module.css';
import { getCookie } from '../../utils/Cookies';

const MainContent = ({ movie, handleWatchClick }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const token = getCookie('jwt');

  useEffect(() => {
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
        console.error('Fetch average rating error:', error);
      }
    };

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
        console.error('Check if favourite error:', error);
      }
    };

    fetchAverageRating();
    checkIfFavourite();
  }, [movie._id, token]);

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const trailerId = getYouTubeId(movie.trailer_url);

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
      alert(data.message);
    } catch (error) {
      console.error('Toggle watchlist error:', error);
    }
  };

  return (
    <section className={styles.mainSection}>
      <div className={styles.background} style={{ backgroundImage: `url(${movie.background_url})` }}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <img src={movie.poster_url} alt={movie.title} className={styles.poster} />
          <div className={styles.details}>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.meta}>
              <span className={styles.quality}>HD</span>
              <span className={styles.genres}>{movie.genre.join(', ')}</span>
              <span className={styles.releaseDate}>{new Date(movie.release_date).getFullYear()}</span>
              <span className={styles.duration}>{movie.duration} min</span>
            </p>
            <div>{numberOfRatings > 0 ? (
              <p className={styles.cast}><strong className={styles.dir}>Rating: </strong>{averageRating.toFixed(1)}/5.0 ({numberOfRatings} rated)</p>
              ) : (
              <p className={styles.cast}><strong className={styles.dir}>Rating: </strong>Unrated</p>
              )}</div>
            <p className={styles.director}><strong className={styles.dir}>Director:</strong> {movie.director.join(', ')}</p>
            <p className={styles.cast}><strong className={styles.dir}>Cast: </strong>{movie.cast.join(', ')}</p>
            <p className={styles.description}>{movie.description}</p>
            <button className={styles.watchNowButton} onClick={handleWatchClick}>Watch Now</button>
            <div className={styles.addToFavouriteContainer}>
              <button className={styles.addToFavouriteButton} onClick={handleAddToFavourite}>
                <div className={isFavourite ? styles.bookmarkIconActive : styles.bookmarkIcon} />
              </button>
              <span className={styles.favouriteText}> Favourite</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.trailerSection}>
        {trailerId ? (
          <YouTube videoId={trailerId} opts={{ width: '23%', height: '230px' }} />
        ) : (
          <div>Trailer not available</div>
        )}
      </div>
    </section>
  );
};

export default MainContent;