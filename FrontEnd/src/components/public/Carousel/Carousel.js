import React, { useEffect, useRef, useState } from 'react';
import styles from './Carousel.module.css';
import { useNavigate } from 'react-router-dom';

const Carousel = () => {
  const carouselRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbnailRef = useRef(null);
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch data from backend
    fetch('http://localhost:5000/public/get-movies') // Thay thế bằng URL API thật của bạn
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => console.error('Error fetching data:', error));

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
  }, []);
  
  const handleWatchClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={styles.carousel} ref={carouselRef}>
      <div className={styles.list} ref={sliderRef}>
        {movies.map((movie, index) => (
          <div className={styles.item} key={index}>
            <img src={movie.background_url} alt={movie.title} />
            <div className={styles.content}>
              <div className={styles.author}>{movie.director}</div>
              <div className={styles.title}>{movie.title}</div>
              <div className={styles.topic}>{movie.genre[1]}</div>
              <div className={styles.des}>{movie.description}</div>
              <div className={styles.buttons}>
                <button className={styles.more} onClick={() => handleWatchClick(movie._id)}>SEE MORE</button>
                <button>SUBSCRIBE</button>
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
              <a href={`/movie/${movie._id}`}>see more</a>
              <h3>{movie.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.arrows}>
        <button id="prev">&lt;</button>
        <button id="next">&gt;</button>
      </div>
      <div className={styles.time}></div>
    </div>
  );
};

export default Carousel;
