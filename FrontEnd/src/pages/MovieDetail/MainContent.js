import React from 'react';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import styles from './MovieDetail.module.css';

const MainContent = ({ movie, handleWatchClick }) => {
  const navigate = useNavigate();

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const trailerId = getYouTubeId(movie.trailer_url);

  return (
    <section className={styles.mainSection}>
      <div className={styles.background} style={{ backgroundImage: `url(${movie.background_url})` }}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <img src={movie.poster_url} alt={movie.title} className={styles.poster} />
          <div className={styles.details}>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.meta}>
              <span className={styles.rating}>{movie.rating}</span>
              <span className={styles.quality}>HD</span>
              <span className={styles.genres}>{movie.genre.join(', ')}</span>
              <span className={styles.releaseDate}>{new Date(movie.release_date).getFullYear()}</span>
              <span className={styles.duration}>{movie.duration} min</span>
            </p>
            <p className={styles.director}><strong className={styles.dir}>Director:</strong> {movie.director.join(', ')}</p>
            <p className={styles.cast}><strong className={styles.dir}>Cast: </strong>{movie.cast.join(', ')}</p>
            <p className={styles.description}>{movie.description}</p>
            <button className={styles.watchNowButton} onClick={handleWatchClick}>Watch Now</button>
          </div>
        </div>
      </div>
      <div className={styles.trailerSection}>
        {trailerId ? (
          <YouTube videoId={trailerId} opts={{ width: '23%', height: '200px' }} />
        ) : (
          <div>Trailer not available</div>
        )}
      </div>
    </section>
  );
};

export default MainContent;
