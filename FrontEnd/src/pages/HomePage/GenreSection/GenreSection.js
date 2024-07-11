import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './GenreSection.module.css';
import { notifyError } from '../../../components/public/Notification/Notification';
import { GrNext, GrPrevious } from "react-icons/gr";
import { FaPlay} from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { getCookie } from '../../../utils/Cookies';


const GenreSection = ({ type }) => {
  const { id } = useParams(); 
  const [watchHistory, setWatchHistory] = useState(null);
  const token = getCookie('jwt');
  const genreItemsRef = useRef([]);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-genres-movie?type=${type || ''}`);
        const data = await response.json();

        const sortedGenres = data.sort((a, b) => b.movies.length - a.movies.length);
        const topGenres = sortedGenres.slice(0, 4);

        setGenres(topGenres);
      } catch (error) {
        notifyError('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [type]);

  const scrollAmount = 200;

  const handleNextClick = (index) => {
    const genreItems = genreItemsRef.current[index];
    if (genreItems) {
      const maxScrollLeft = genreItems.scrollWidth - genreItems.clientWidth;
      let currentScrollPosition = genreItems.scrollLeft;
      currentScrollPosition = currentScrollPosition >= maxScrollLeft ? 0 : currentScrollPosition + scrollAmount;
      genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
    }
  };

  const handlePrevClick = (index) => {
    const genreItems = genreItemsRef.current[index];
    if (genreItems) {
      let currentScrollPosition = genreItems.scrollLeft;
      currentScrollPosition = currentScrollPosition <= 0 ? genreItems.scrollWidth - genreItems.clientWidth : currentScrollPosition - scrollAmount;
      genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
    }
  };

  const handleWatchClick = async (movieId) => {
    const fetchWatchHistory = async (movieId) => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-history/${movieId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to load watch history');
        }
        const data = await response.json();
        setWatchHistory(data);
        return data;
      } catch (err) {
        console.error('Failed to load watch history:', err);
        return null;
      }
    };

    sessionStorage.setItem('hasReloaded', 'false');
    if (token) {
      const history = await fetchWatchHistory(movieId); // Fetch watch history for the specific movie
      if (history) {
        navigate(`/streaming/${movieId}`, { state: { time: history.currentTime, episode: history.latestEpisode - 1 } });
      } else {
        navigate(`/streaming/${movieId}`);
      }
    } else {
      navigate(`/streaming/${movieId}`);
    }
  };

  const handleMoreDetailsClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const truncateDescription = (description, movieId) => {
    const lines = description.split(' ');
    if (lines.length > 10) {
      return (
        <span>
          {lines.slice(0, 12).join(' ')}...{' '}
          <div className={styles.seeMore} onClick={() => handleMoreDetailsClick(movieId)}>
            More Details
          </div>
        </span>
      );
    }
    return description;
  };

  return (
    <div className={styles.genreSectionsContainer}>
      {genres.length > 0 && genres.map((genre, index) => (
        <div key={index} className={styles.genreSection}>
          <h2>{genre.name + (type === 'series' ? ' Series' : ' Movies')}</h2>
          <div className={styles.genreList}>
            <button className={styles.prevGenre} onClick={() => handlePrevClick(index)}><GrPrevious /></button>
            <div className={styles.genreItems} ref={(el) => genreItemsRef.current[index] = el}>
              {genre.movies && genre.movies.map((movie, movieIndex) => (
                <div className={styles.item} key={movieIndex}>
                  <div className={styles.imageContainer}>
                    <img src={movie.poster_url} alt={movie.title} />
                    <div className={styles.hoverSection}>
                      <div className={styles.topSection} style={{ backgroundImage: `url(${movie.background_url})` }}></div>
                      <div className={styles.bottomSection}>
                        <div className={styles.topLeft}>
                        <div className={styles.buttonComb}>
                          <button className={styles.watchButton} onClick={() => handleWatchClick(movie._id)}><FaPlay /></button>
                          <button className={styles.addToFavoritesButton} onClick={() => handleWatchClick(movie._id)}><FaCheckCircle /></button>
                        </div>
                          <div className={styles.genre}>{truncateDescription(movie.full_description, movie._id)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.title}>{movie.title}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.nextGenre} onClick={() => handleNextClick(index)}><GrNext /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenreSection;
