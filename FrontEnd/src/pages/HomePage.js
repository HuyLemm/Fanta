import React, { useEffect } from 'react';
import styles from '../assets/styles/HomePage.module.css';
import Carousel from '../components/public/Carousel/Carousel';
import GenreSection from '../components/public/GenreSection/GenreSection';

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
      <Carousel />
      <GenreSection />
    </div>
  );
}

export default HomePage;
