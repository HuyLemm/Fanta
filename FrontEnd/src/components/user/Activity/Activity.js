import React, { useEffect, useState } from 'react';
import { getCookie } from '../../../utils/Cookies';
import Notification, { notifyError, notifySuccess } from '../../public/Notification/Notification';
import Loading from '../../public/LoadingEffect/Loading';
import styles from './Activity.module.css';
import { useNavigate } from 'react-router-dom';

const Activity = ({ setCurrentFunction }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const token = getCookie('jwt');
  const navigate = useNavigate();

  const fetchActivity = async () => {
    try {
      const response = await fetch('https://fanta-kappa.vercel.app/user/get-activity', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setActivities(data);
      setFilteredActivities(data);
    } catch (error) {
      notifyError(error.message);
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [token]);

  useEffect(() => {
    filterActivities();
  }, [filter, timeFilter, activities]);

  const filterActivities = () => {
    let filtered = activities;

    if (filter !== 'all') {
      filtered = filtered.filter(activity => activity.action === filter);
    }

    if (timeFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.createdAt);
        switch (timeFilter) {
          case '1hour':
            return (now - activityDate) / 1000 / 60 <= 60;
          case '1day':
            return (now - activityDate) / 1000 / 60 / 60 <= 24;
          case '1week':
            return (now - activityDate) / 1000 / 60 / 60 / 24 <= 7;
          case '1month':
            return (now - activityDate) / 1000 / 60 / 60 / 24 <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredActivities(filtered);
  };

  if (loading) {
    return <Loading />;
  }

  const handleSelectClick = () => {
    setSelectMode(!selectMode);
    setSelectedActivities([]);
  };

  const handleSelectActivity = (id) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter(activityId => activityId !== id));
    } else {
      setSelectedActivities([...selectedActivities, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedActivities.length === filteredActivities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(filteredActivities.map(activity => activity._id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await fetch('https://fanta-kappa.vercel.app/user/delete-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activityIds: selectedActivities }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setActivities(activities.filter(activity => !selectedActivities.includes(activity._id)));
      setSelectedActivities([]);
      setSelectMode(false);
      notifySuccess(data.message);
    } catch (error) {
      notifyError(error.message);
      console.error('Error deleting activities:', error);
    }
  };

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  const handleClick = (activityAction, activitymovieId) => {
    switch (activityAction) {
      case 'addRating':
        navigate(`/streaming/${activitymovieId}`);
        break;
      case 'addReview':
        navigate(`/streaming/${activitymovieId}`);
        break;
      case 'updateProfile':
        if (setCurrentFunction) {
          setCurrentFunction('Profile');
        }
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
      <div className={styles.fixedHeader}>
        <div className={styles.leftGroup}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={styles.filterSelect}>
            <option value="all">All Activity</option>
            <option value="addRating">Rating</option>
            <option value="addReview">Review</option>
            <option value="saveHistory">Watching History</option>
            <option value="addToWatchlist">Watchlist</option>
            <option value="updateProfile">User Profile</option>
          </select>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className={styles.timeFilterSelect}>
            <option value="all">All Time</option>
            <option value="1hour">Last 1 Hour</option>
            <option value="1day">Last 1 Day</option>
            <option value="1week">Last 1 Week</option>
            <option value="1month">Last 1 Month</option>
          </select>
        </div>
        <h1 className={styles.h2}>Activity</h1>
        <div className={styles.rightGroup}>
          {!selectMode && (
            <button className={styles.selectButton} onClick={handleSelectClick}>Select</button>
          )}
          {selectMode && (
            <>
              <input
                type="checkbox"
                className={styles.checkboxAll}
                checked={selectedActivities.length === filteredActivities.length}
                onChange={handleSelectAll}
              />
              <span>Select All</span>
              <button className={styles.deleteSelectedButton} onClick={handleDeleteSelected} disabled={selectedActivities.length === 0}>
                Delete Selected
              </button>
              <button className={styles.cancelButton} onClick={handleSelectClick}>Cancel</button>
            </>
          )}
        </div>
      </div>
      {Object.keys(groupedActivities).map(date => (
        <div key={date}>
          <h2 className={styles.dateHeader}>{date}</h2>
          {groupedActivities[date].map((activity, index) => (
            <div
              key={index}
              className={`${styles.activityItem} ${selectMode && styles.selectMode}`}
              onClick={() => !selectMode && handleClick(activity.action, activity.movieId)}
            >
              {selectMode && (
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedActivities.includes(activity._id)}
                  onChange={() => handleSelectActivity(activity._id)}
                />
              )}
              <div className={styles.activityContentWrapper}>
                <img src={activity.avatar} alt="User Avatar" className={styles.avatar} />
                <div className={styles.activityContent}>
                  <p className={styles.username}>{activity.username}</p>
                  <p className={styles.details}>{activity.details}</p>
                  <p className={styles.time}>{new Date(activity.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Activity;
