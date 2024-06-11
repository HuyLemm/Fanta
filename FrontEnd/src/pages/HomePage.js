import React from 'react';
import styles from '../assets/styles/HomePage.module.css';
import Carousel from '../components/Carousel';
import GenreSection from '../components/GenreSection';

function HomePage() {
  return (
    <div className={styles.homePage}>
      <Carousel />
      <GenreSection title="Action Movies" />
      <GenreSection title="Comedy Movies" />
    </div>
  );
}

export default HomePage;
