import React, { useState, useEffect } from 'react';
import styles from './RatingsDescription.module.css';
import { getCookie } from '../../../utils/Cookies';
import { useNavigate } from 'react-router-dom';
import Notification, {notifyError, notifySuccess, notifyInfo, notifyWarning} from '../../../components/public/Notification/Notification';

const RatingsDescription = ({ movie, id, currentUser }) => {
  const [userRating, setUserRating] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const token = getCookie('jwt');
  const navigate = useNavigate();

  // Lấy đánh giá của người dùng cho phim hiện tại
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
        notifyError('Fetch rating error:', error);
      }
    };

    fetchUserRating();
  }, [id, currentUser]);

  // Xử lý khi người dùng click để đánh giá
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
      notifyError('Add rating error:', error);
    }
  };

  return (
    <>
      {/* Khu vực đánh giá */}
      <div className={styles.ratingSection}>
        <Notification />
        <h2>Rating:</h2> {/* Tiêu đề */}
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

      {/* Khu vực mô tả */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.headerDescription}>Description</h2> {/* Tiêu đề */}
        <p className={`${styles.descriptionText} ${isExpanded ? styles.expanded : ''}`}>
          {movie.full_description}
        </p>
        <div className={styles.morebutton}>
          <button className={styles.toggleButton} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'More'}
            <svg
              className={`${styles.arrowIcon} ${isExpanded ? styles.rotateUp : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button> {/* Nút mở rộng hoặc thu gọn mô tả */}
        </div>
      </div>
    </>
  );
};

export default RatingsDescription;
