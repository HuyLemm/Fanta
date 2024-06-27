import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './Comment.module.css';
import moment from 'moment';
import { getCookie } from '../../../utils/Cookies';
import { useNavigate } from 'react-router-dom';

const Comments = ({ movieId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banDuration, setBanDuration] = useState({ value: 0, unit: 'seconds' });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const token = getCookie('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/get-reviews-movie-id/${movieId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Fetch comments error:', error);
      }
    };

    fetchComments();
  }, [movieId]);

  const handleAddComment = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/user/add-reviews/${movieId}`, {
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

  return (
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

export default Comments;
