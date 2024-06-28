import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyFavourite.module.css';
import { getCookie } from '../../../../utils/Cookies';

const Favourite = () => {
  const navigate = useNavigate();
  const token = getCookie('jwt');

  const handleFavoriteClick = () => {
    if (token) {
      navigate('/favorite');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={styles.favouriteContainer}>
      <button className={styles.favoriteButton} onClick={handleFavoriteClick}>My Favorite</button>
    </div>
  );
};

export default Favourite;
