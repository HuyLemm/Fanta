import React, { useEffect, useRef, useState } from 'react';
import styles from './Carousel.module.css';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../../utils/Cookies';
import { notifySuccess, notifyError, notifyWarning } from '../../../components/public/Notification/Notification';
import Loading from '../../../components/public/LoadingEffect/Loading';
import MovieModal from '../MovieModal/MovieModal'; // Import the MovieModal component

const Carousel = ({ type }) => {
  const carouselRef = useRef(null); 
  const sliderRef = useRef(null); 
  const thumbnailRef = useRef(null); 
  const navigate = useNavigate(); 
  const token = getCookie('jwt'); // Get JWT token from cookies

  const [movies, setMovies] = useState([]); 
  const [watchlists, setWatchlists] = useState({}); 
  const [loading, setLoading] = useState(true); 
  const [selectedMovie, setSelectedMovie] = useState(null); // State to manage the selected movie
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true); 
        const response = await fetch(`http://localhost:5000/public/get-top-rated-movies?type=${type || ''}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        // Filter movies based on type if specified
        const filteredMovies = data.filter(movie => !type || movie.type === type);
        setMovies(filteredMovies);

        // Fetch watchlist status for each movie if token is available
        if (token) {
          filteredMovies.forEach(movie => {
            checkIfWatchlisted(movie.id, token);
          });
        } else {
          setWatchlists({});
        }
      } catch (error) {
        notifyError('Error fetching data:', error);
      } finally {
        setLoading(false); 
      }
    };
    fetchMovies();
  }, [token, type]);

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

      function showSlider(direction) {
        if (!slider || !thumbnailBorder || !carousel) return;

        let sliderItems = slider.children;
        let thumbnailItems = thumbnailBorder.children;

        if (sliderItems.length === 0 || thumbnailItems.length === 0) return;

        if (direction === 'next') {
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

      if (next) next.onclick = () => showSlider('next');
      if (prev) prev.onclick = () => showSlider('prev');

      runNextAuto = setTimeout(() => {
        if (next) next.click();
      }, timeAutoNext);

      return () => {
        clearTimeout(runNextAuto);
        clearTimeout(runTimeOut);
      };
    }
  }, [loading]);

  const checkIfWatchlisted = async (movieId, token) => {
    if (!token) return;

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
      console.log('Check if watchlisted error:', error);
    }
  };

  const updateWatchlistStatuses = async () => {
    if (!token) return;

    try {
      for (const movie of movies) {
        await checkIfWatchlisted(movie.id, token);
      }
    } catch (error) {
      console.error('Error updating watchlist statuses:', error);
    }
  };

  useEffect(() => {
    if (token && movies.length > 0) {
      const interval = setInterval(updateWatchlistStatuses, 60000); // Update every 60 seconds

      return () => clearInterval(interval);
    }
  }, [token, movies]);

  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleWatchlistClick = async (movieId) => {
    if (!token) {
      notifyWarning('You need to log in first to archive');
      return;
    }

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
      notifySuccess(data.message); // Show success notification
    } catch (error) {
      notifyError('Error updating watchlist:', error);
    }
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.carousel} ref={carouselRef}>
      {loading ? (
        <div><Loading /></div> // Show loading message while fetching data
      ) : (
        <>
          <div className={styles.list} ref={sliderRef}>
            {movies.map((movie, index) => (
              <div className={styles.item} key={index}>
                <div className={styles.overlay}></div>
                {/* Movie background image */}
                <img src={movie.background_url} alt={movie.title} className={styles.img}/>
                {/* Content for the movie item */}
                <div className={styles.content}>
                  <div className={styles.author}>{movie.director.join(', ')}</div>
                  <div className={styles.title}>{movie.title}</div>
                  <div className={styles.topic}>{movie.genre[0]}</div>
                  <div className={styles.des}>{movie.brief_description}</div>
                  <div className={styles.buttons}>
                    <button className={styles.moreMain} onClick={() => handleWatchClick(movie.id)}>VIEW</button>
                    <button onClick={() => handleWatchlistClick(movie.id)}>
                      {watchlists[movie.id] ? 'UNARCHIVE' : 'ARCHIVE'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Thumbnails for the movies */}
          <div className={styles.thumbnail} ref={thumbnailRef}>
            {movies.map((movie, index) => (
              <div 
                className={`${styles.item} ${styles.movieThumbnail}`} 
                key={index}
              >
                <img src={movie.poster_url} alt={movie.title} />
                <div className={styles.movieInfo}>
                  <button className={styles.more} onClick={() => openModal(movie)}>See More</button>
                  <h3 className={styles.h3}>{movie.title}</h3>
                </div>
              </div>
            ))}
          </div>
          {/* Navigation arrows */}
          <div className={styles.arrows}>
            <button id="prev">&lt;</button>
            <button id="next">&gt;</button>
          </div>
          <div className={styles.time}></div>
          <MovieModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            movie={selectedMovie}
          />
        </>
      )}
    </div>
  );
};

export default Carousel;
