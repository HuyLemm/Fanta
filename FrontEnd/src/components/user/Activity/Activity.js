import React, { useEffect, useState } from 'react';
import { getCookie } from '../../../utils/Cookies';
import Notification, { notifyError, notifySuccess } from '../../public/Notification/Notification';
import Loading from '../../public/LoadingEffect/Loading';
import styles from './Activity.module.css';
import { useNavigate } from 'react-router-dom';

const Activity = ({ setCurrentFunction }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getCookie('jwt');
  const navigate = useNavigate();

  const fetchActivity = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/get-activity', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      notifyError(error.message);
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveActivity = async (activityId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:5000/user/delete-activity/${activityId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      notifySuccess('Activity removed successfully');
      setActivities(activities.filter(activity => activity._id !== activityId));
    } catch (error) {
      notifyError(error.message);
      console.error('Error removing activity:', error);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [token]);

  if (loading) {
    return <Loading />;
  }

  const groupedActivities = activities.reduce((groups, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  const handleClick = (activityAction, activitymovieId) => {
    console.log(activityAction, activitymovieId);
    switch (activityAction) {
      case 'addRating':
        navigate(`/streaming/${activitymovieId}`);
        break;
      case 'addReview':
        navigate(`/streaming/${activitymovieId}`);
        break;
      case 'updateProfile':
        navigate('/user');
        break;
      case 'addToWatchlist':
        navigate('/favorite');
        break;
      case 'saveHistory':
        if (setCurrentFunction) {
          setCurrentFunction('My History');
        }
        navigate('/user');
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.activityContainer}>
      <Notification />
      <h1 className={styles.heading}>Activity</h1>
      {Object.keys(groupedActivities).map(date => (
        <div key={date}>
          <h2 className={styles.dateHeader}>{date}</h2>
          {groupedActivities[date].map((activity, index) => (
            <div
              key={index}
              className={styles.activityItem}
              onClick={() => handleClick(activity.action, activity.movieId)}
            >
              <div className={styles.activityContentWrapper}>
                <img src={activity.avatar} alt="User Avatar" className={styles.avatar} />
                <div className={styles.activityContent}>
                  <p className={styles.username}>{activity.username}</p>
                  <p className={styles.details}>{activity.details}</p>
                  <p className={styles.time}>{new Date(activity.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <button className={styles.removeButton} onClick={(e) => handleRemoveActivity(activity._id, e)}>Remove</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Activity;
