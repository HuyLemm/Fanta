import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './Comment.module.css';
import moment from 'moment';
import { getCookie } from '../../../utils/Cookies';
import { useNavigate } from 'react-router-dom';
import Notification, { notifySuccess, notifyError, notifyWarning, notifyInfo } from '../../../components/public/Notification/Notification';

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

  // Lấy danh sách các bình luận cho phim hiện tại
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
        notifyError('Fetch comments error:', error);
      }
    };

    fetchComments();
  }, [movieId]);

  // Thêm bình luận mới
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
          notifyWarning(errorData.message); // Hiển thị thông báo nếu người dùng bị cấm bình luận
        } else {
          throw new Error('Failed to add comment');
        }
        return;
      }

      const newCommentData = await response.json();
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
    } catch (error) {
      notifyError('Add comment error:', error);
    }
  };

  // Xóa bình luận
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
      notifyError('Delete comment error:', error);
    }
  };

  // Chỉnh sửa bình luận
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
          notifyWarning(errorData.message); // Hiển thị thông báo nếu người dùng bị cấm bình luận
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
      notifyError('Edit comment error:', error);
    }
  };

  // Cấm người dùng
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

      notifySuccess('User banned successfully');
      closeBanModal(); // Đóng modal sau khi cấm người dùng
    } catch (error) {
      notifyError('Ban user error:', error);
    }
  };

  // Mở modal cấm người dùng
  const openBanModal = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // Đóng modal cấm người dùng
  const closeBanModal = () => {
    setIsModalOpen(false);
    setBanDuration({ value: 0, unit: 'seconds' });
    setSelectedUserId(null);
  };

  return (
    // Khu vực bình luận
    <div className={styles.commentsSection}>
      <Notification />
      <h2>Comments</h2> {/* Tiêu đề */}
      {comments.length > 0 ? (
        comments.map(comment => (
          <div key={comment._id} className={styles.comment}>
            {editingCommentId === comment._id ? (
              <div>
                <textarea
                  value={editingCommentText}
                  onChange={(e) => setEditingCommentText(e.target.value)}
                  className={styles.edittext}
                />
                <button onClick={() => handleEditComment(comment._id)} className={styles.comButton}>Save</button>
                <button onClick={() => setEditingCommentId(null)} className={styles.comButton}>Cancel</button>
              </div>
            ) : (
              <>
                <div className={styles.commentContent}>
                  <img src={comment.userId.avatar} alt={`${comment.userId.username}'s avatar`} className={styles.avatar} />
                  <div className={styles.commentInfo}>
                    <p className={styles.line1}>
                      <span className={styles.username}>{comment.userId.username}</span>
                      <span className={styles.time}> ( {moment(comment.created_at).fromNow()} )</span>
                    </p>
                    <p className={styles.commentText}>{comment.comment}</p>
                  </div>
                </div>
                <div className={styles.commentActions}>
                  {(comment.userId._id === currentUser?._id) && (
                    <>
                      <button onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditingCommentText(comment.comment);
                      }} className={styles.comButton}>Edit</button>
                      <button onClick={() => handleDeleteComment(comment._id)} className={styles.comButton}>Delete</button>
                    </>
                  )}
                  {(currentUser?.role === 'admin') && (
                    <>
                      <button onClick={() => handleDeleteComment(comment._id)} className={styles.comButton}>Delete</button>
                      <button onClick={() => openBanModal(comment.userId._id)} className={styles.comButton}>Ban User</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <div>Share your thoughts</div>
      )}
      <div className={styles.addComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment} className={styles.comButton}>Submit</button>
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
          <button onClick={handleBanUser} className={styles.comButton}>Ban</button>
          <button onClick={closeBanModal} className={styles.comButton}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default Comments;
