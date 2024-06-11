import React, { useRef } from 'react';
import styles from '../assets/styles/GenreSection.module.css';
import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.jpg';

const GenreSection = ({ title }) => {
  const genreItemsRef = useRef(null);
  let currentScrollPosition = 0;
  const scrollAmount = 200;

  const handleNextClick = () => {
    const genreItems = genreItemsRef.current;
    const maxScrollLeft = genreItems.scrollWidth - genreItems.clientWidth;
    if (currentScrollPosition >= maxScrollLeft) {
      currentScrollPosition = 0;
    } else {
      currentScrollPosition += scrollAmount;
    }
    genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
  };

  const handlePrevClick = () => {
    const genreItems = genreItemsRef.current;
    if (currentScrollPosition <= 0) {
      currentScrollPosition = genreItems.scrollWidth - genreItems.clientWidth;
    } else {
      currentScrollPosition -= scrollAmount;
    }
    genreItems.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });
  };

  return (
    <div className={styles.genreSection}>
      <h2>{title}</h2>
      <div className={styles.genreList}>
        <button className={styles.prevGenre} onClick={handlePrevClick}>&lt;</button>
        <div className={styles.genreItems} ref={genreItemsRef}>
          {[img1, img2, img3, img4].map((src, index) => (
            <div className={styles.item} key={index}>
              <img src={src} alt={`Movie ${index + 1}`} />
              <div className={styles.content}>
                <div className={styles.title}>Movie {index + 1}</div>
                <div className={styles.description}>Description</div>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.nextGenre} onClick={handleNextClick}>&gt;</button>
      </div>
    </div>
  );
};

export default GenreSection;
