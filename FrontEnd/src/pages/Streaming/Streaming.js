import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Streaming.module.css';
import { getCookie } from '../../utils/Cookies';

const Streaming = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
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
        setCurrentUserId(data.userId);
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
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Fetch comments error:', error);
      }
    };

    fetchCurrentUser();
    fetchMovie();
    fetchComments();
  }, [id, token]);

  const handleAddComment = async () => {
    if (!token) {
      navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu người dùng chưa đăng nhập
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
        throw new Error('Failed to add comment');
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
      const response = await fetch(`http://localhost:5000/user/delete-reviews/${commentId}`, {
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
        throw new Error('Failed to update comment');
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
      <div className={styles.videoSection}>
        <h1 className={styles.streamingTitle}>{movie.title}</h1>
        <video className={styles.streamingVideo} controls>
          <source src={movie.streaming_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
                  <p><strong>{comment.userId.username}</strong>: {comment.comment}</p>
                  {comment.userId._id === currentUserId && (
                    <>
                      <button onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditingCommentText(comment.comment);
                      }}>Edit</button>
                      <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
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
    </div>
  );
};

export default Streaming;
