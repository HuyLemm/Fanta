import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import styles from './Streaming.module.css';
import { getCookie } from '../../utils/Cookies';
import moment from 'moment';

Modal.setAppElement('#root'); // This is important for accessibility

const Streaming = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banDuration, setBanDuration] = useState({ value: 0, unit: 'seconds' });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();
  const token = getCookie('jwt');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/public/get-current-user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-movie-by-id/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-reviews-movie-id/${id}`);
        console.log('Fetching comments...', response);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Fetch comments error:', error);
      }
    };

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

    fetchCurrentUser();
    fetchMovie();
    fetchComments();
    if (currentUser) {
      fetchUserRating();
    }
  }, [id, token, currentUser]);

  const handleAddComment = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/user/add-reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment: newComment })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          alert(errorData.message); // Hiển thị thông báo nếu người dùng bị cấm bình luận
        } else {
          throw new Error('Failed to add comment');
        }
        return;
      }
  
      const newCommentData = await response.json();
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Add comment error:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const url = currentUser?.role === 'admin'
        ? `http://localhost:5000/admin/delete-reviews/${commentId}`
        : `http://localhost:5000/user/delete-reviews/${commentId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/update-reviews/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment: editingCommentText })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          alert(errorData.message); // Hiển thị thông báo nếu người dùng bị cấm bình luận
        } else {
          throw new Error('Failed to add comment');
        }
        return;
      }

      const updatedComment = await response.json();
      setComments((prevComments) =>
        prevComments.map(comment => (comment._id === commentId ? updatedComment : comment))
      );
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (error) {
      console.error('Edit comment error:', error);
    }
  };

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

  const handleBanUser = async () => {
    const banUntil = new Date();
    switch (banDuration.unit) {
      case 'seconds':
        banUntil.setSeconds(banUntil.getSeconds() + parseInt(banDuration.value, 10));
        break;
      case 'minutes':
        banUntil.setMinutes(banUntil.getMinutes() + parseInt(banDuration.value, 10));
        break;
      case 'hours':
        banUntil.setHours(banUntil.getHours() + parseInt(banDuration.value, 10));
        break;
      case 'days':
        banUntil.setDate(banUntil.getDate() + parseInt(banDuration.value, 10));
        break;
      case 'years':
        banUntil.setFullYear(banUntil.getFullYear() + parseInt(banDuration.value, 10));
        break;
      default:
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/admin/ban-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: selectedUserId, banUntil })
      });

      if (!response.ok) {
        throw new Error('Failed to ban user');
      }

      alert('User banned successfully');
      closeBanModal(); // Close the modal after banning the user
    } catch (error) {
      console.error('Ban user error:', error);
    }
  };

  const openBanModal = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const closeBanModal = () => {
    setIsModalOpen(false);
    setBanDuration({ value: 0, unit: 'seconds' });
    setSelectedUserId(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>No movie data found</div>;
  }

  return (
    <div className={styles.streamingContainer}>
      <div className={styles.header}>
        <h1>{movie.title}</h1>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.videoSection}>
          <video className={styles.streamingVideo} controls>
            <source src={movie.streaming_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={styles.episodesSection}>
          <h2>Episodes</h2>
          {/* Add your episodes list here */}
        </div>
      </div>
      <div className={styles.ratingSection}>
        <h2>Rate this movie</h2>
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
      <div className={styles.commentsSection}>
        <h2>Comments</h2>
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment._id} className={styles.comment}>
              {editingCommentId === comment._id ? (
                <div>
                  <textarea
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                  />
                  <button onClick={() => handleEditComment(comment._id)}>Save</button>
                  <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>
                    <img src={comment.userId.avatar} alt={`${comment.userId.username}'s avatar`} className={styles.avatar} />
                    <strong>{comment.userId.username}</strong>: {comment.comment} <span className={styles.time}>{moment(comment.created_at).fromNow()}</span>
                  </p>
                  {(comment.userId._id === currentUser?._id) && (
                    <>
                      <button onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditingCommentText(comment.comment);
                      }}>Edit</button>
                      <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                    </>
                  )}
                  {(currentUser?.role === 'admin') && (
                    <>
                      <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                      <button onClick={() => openBanModal(comment.userId._id)}>Ban User</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No comments found</div>
        )}
        <div className={styles.addComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleAddComment}>Submit</button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeBanModal}
        contentLabel="Ban User"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Ban User</h2>
        <div className={styles.modalContent}>
          <label>
            Duration:
            <input
              type="number"
              value={banDuration.value}
              onChange={(e) => setBanDuration({ ...banDuration, value: e.target.value })}
            />
          </label>
          <label>
            Unit:
            <select
              value={banDuration.unit}
              onChange={(e) => setBanDuration({ ...banDuration, unit: e.target.value })}
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="years">Years</option>
            </select>
          </label>
          <button onClick={handleBanUser}>Ban</button>
          <button onClick={closeBanModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default Streaming;
