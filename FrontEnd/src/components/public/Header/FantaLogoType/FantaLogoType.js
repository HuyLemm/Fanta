import React from 'react';
import { useNavigate } from 'react-router-dom';
import fantaImage from '../../../../assets/images/fanta.png';
import styles from './FantaLogoType.module.css';

const FantaLogoType = () => {
  const navigate = useNavigate();

  const handleMovieClick = () => {
    navigate('/?type=movie');
  };

  const handleSeriesClick = () => {
    navigate('/?type=series');
  };

  return (
    <header className={styles.header}>
      <a href="/">
        <img src={fantaImage} className={styles.fanta} alt="Fanta" />
      </a>
      <div className={styles.typeButtons}>
        <button className={styles.movies} onClick={handleMovieClick}>Movie</button>
        <button className={styles.series} onClick={handleSeriesClick}>Series</button>
      </div>
    </header>
  );
};

export default FantaLogoType;
