import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/HomePage.module.css';
import Carousel from './auth/Carousel';
import GenreSection from './auth/GenreSection';

function HomePage() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Function to fetch genres from the backend
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/genres'); // URL đến API của bạn
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGenres(data); // Giả sử data là mảng các tên genre
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const renderGenreSections = () => {
    return genres.map((genre, index) => (
      <GenreSection key={index} title={genre} />
    ));
  };

  return (
    <div className={styles.homePage}>
      <Carousel />
      {renderGenreSections()}
    </div>
  );
}

export default HomePage;
