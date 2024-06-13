import React, { useEffect } from 'react';
import styles from '../assets/styles/HomePage.module.css';
import Carousel from '../components/public/Carousel'
import GenreSection from '../components/public/GenreSection';
import TestCreateGenre from '../components/public/testCreateGenre';
import TestCarousel from '../components/public/testCarousel';

function HomePage() {
  useEffect(() => {
    if (!sessionStorage.getItem('isRefreshed')) {
      sessionStorage.setItem('isRefreshed', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('isRefreshed');
    }
  }, []);

  return (
    <div className={styles.homePage}>
      <TestCarousel />
      <TestCreateGenre />
    </div>
  );
}

export default HomePage;
