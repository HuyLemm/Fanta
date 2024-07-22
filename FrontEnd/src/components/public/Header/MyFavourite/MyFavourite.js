import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyFavourite.module.css';
import { getCookie } from '../../../../utils/Cookies';
import { notifySuccess, notifyError, notifyWarning, notifyInfo } from '../../../../components/public/Notification/Notification';
const Favourite = () => {
  const navigate = useNavigate();
  const token = getCookie('jwt');

  const handleFavoriteClick = () => {
    if (token) {
      navigate('/favorite');
    } else {
      notifyWarning('Please login first!');
    }
  };

  return (
    <div className={styles.favouriteContainer}>
      <button className={styles.favoriteButton} onClick={handleFavoriteClick}>My List</button>
    </div>
  );
};

export default Favourite;
