import React, { useEffect, useRef, useState } from 'react';
import styles from './Carousel.module.css';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../../utils/Cookies';

const Carousel = () => {
  const carouselRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbnailRef = useRef(null);
  const navigate = useNavigate();
  const token = getCookie('jwt');

  const [movies, setMovies] = useState([]);
  const [watchlists, setWatchlists] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch('http://localhost:5000/public/get-top-rated-movies');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setMovies(data);

        // Fetch watchlist status for each movie
        data.forEach(movie => {
          checkIfWatchlisted(movie.id, token);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchMovies();
  }, [token]);

  useEffect(() => {
    if (!loading) {
      const next = document.getElementById('next');
      const prev = document.getElementById('prev');
      const carousel = carouselRef.current;
      const slider = sliderRef.current;
      const thumbnailBorder = thumbnailRef.current;

      let timeRunning = 3000;
      let timeAutoNext = 7000;
      let runTimeOut;
      let runNextAuto;

      function showSlider(type) {
        let sliderItems = slider.children;
        let thumbnailItems = thumbnailBorder.children;

        if (type === 'next') {
          slider.appendChild(sliderItems[0]);
          thumbnailBorder.appendChild(thumbnailItems[0]);
          carousel.classList.add(styles.next);
        } else {
          slider.prepend(sliderItems[sliderItems.length - 1]);
          thumbnailBorder.prepend(thumbnailItems[thumbnailItems.length - 1]);
          carousel.classList.add(styles.prev);
        }

        clearTimeout(runTimeOut);
        runTimeOut = setTimeout(() => {
          carousel.classList.remove(styles.next);
          carousel.classList.remove(styles.prev);
        }, timeRunning);

        clearTimeout(runNextAuto);
        runNextAuto = setTimeout(() => {
          next.click();
        }, timeAutoNext);
      }

      next.onclick = () => showSlider('next');
      prev.onclick = () => showSlider('prev');

      runNextAuto = setTimeout(() => {
        next.click();
      }, timeAutoNext);

      return () => {
        clearTimeout(runNextAuto);
        clearTimeout(runTimeOut);
      };
    }
  }, [loading]);

  const checkIfWatchlisted = async (movieId, token) => {
    try {
      const response = await fetch(`http://localhost:5000/public/get-watchlist/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setWatchlists(prevWatchlists => ({
        ...prevWatchlists,
        [movieId]: data.isFavourite
      }));
    } catch (error) {
      console.error('Check if watchlisted error:', error);
    }
  };

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleWatchlistClick = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/toggle-watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setWatchlists(prevWatchlists => ({
        ...prevWatchlists,
        [movieId]: data.isFavourite
      }));
    } catch (error) {
      console.error('Toggle watchlist error:', error);
    }
  };

  return (
    <div className={styles.carousel} ref={carouselRef}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={styles.list} ref={sliderRef}>
            {movies.map((movie, index) => (
              <div className={styles.item} key={index}>
                <div className={styles.overlay}></div>
                <img src={movie.background_url} alt={movie.title} className={styles.img}/>
                <div className={styles.content}>
                  <div className={styles.author}>{movie.director.join(', ')}</div>
                  <div className={styles.title}>{movie.title}</div>
                  <div className={styles.topic}>{movie.genre[0]}</div>
                  <div className={styles.des}>{movie.brief_description}</div>
                  <div className={styles.buttons}>
                    <button className={styles.more} onClick={() => handleWatchClick(movie.id)}>VIEW</button>
                    <button onClick={() => handleWatchlistClick(movie.id)}>
                      {watchlists[movie.id] ? 'UNARCHIVE' : 'ARCHIVE'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.thumbnail} ref={thumbnailRef}>
            {movies.map((movie, index) => (
              <div className={`${styles.item} ${styles.movieThumbnail}`} key={index}>
                <img src={movie.poster_url} alt={movie.title} />
                <div className={styles.content}></div>
                <div className={styles.movieInfo}>
                  <a href={`/movie/${movie.id}`}>See More</a>
                  <h3 className={styles.h3}>{movie.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.arrows}>
            <button id="prev">&lt;</button>
            <button id="next">&gt;</button>
          </div>
          <div className={styles.time}></div>
        </>
      )}
    </div>
  );
};

export default Carousel;
