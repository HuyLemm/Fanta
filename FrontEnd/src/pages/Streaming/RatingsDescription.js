import React, { useState, useEffect } from 'react';
import styles from './Streaming.module.css';
import { getCookie } from '../../utils/Cookies';
import { useNavigate } from 'react-router-dom';

const RatingsDescription = ({ movie, id, currentUser }) => {
  const [userRating, setUserRating] = useState(0);
  const token = getCookie('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-rating/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const userRate = data.find(rating => rating.userId._id === currentUser?._id);
        setUserRating(userRate ? userRate.rating : 0);
      } catch (error) {
        console.error('Fetch rating error:', error);
      }
    };

    fetchUserRating();
  }, [id, currentUser]);

  const handleRatingClick = async (ratingValue) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/user/add-and-update-rating/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: ratingValue })
      });

      if (!response.ok) {
        throw new Error('Failed to add rating');
      }

      const newRating = await response.json();
      setUserRating(newRating.rating);
    } catch (error) {
      console.error('Add rating error:', error);
    }
  };

  return (
    <>
      <div className={styles.ratingSection}>
        <h2>Rating:</h2>
        <div className={styles.stars}>
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={index < userRating ? styles.starFilled : styles.star}
              onClick={() => handleRatingClick(index + 1)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className={styles.descriptionSection}>
        <h2 className={styles.headerDescription}>Description</h2>
        <p>{movie.full_description}</p>
      </div>
    </>
  );
};

export default RatingsDescription;
