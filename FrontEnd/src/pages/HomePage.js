import React, { useEffect } from 'react';
import styles from '../assets/styles/HomePage.module.css';
import Carousel from '../components/auth/Carousel';
import GenreSection from '../components/auth/GenreSection';

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
      <GenreSection title="Action Movies" />
      <GenreSection title="Comedy Movies" />
    </div>
  );
}

export default HomePage;
