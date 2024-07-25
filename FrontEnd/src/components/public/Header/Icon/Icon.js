import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import userIcon from '../../../../assets/images/user.png';
import guestIcon from '../../../../assets/images/guest.png';
import adminIcon from '../../../../assets/images/admin.jpg';
import styles from './Icon.module.css';
import { AuthContext } from '../../../../components/auth/AuthContext';
import Loading from '../../../public/LoadingEffect/Loading';
import { MdBookmarkAdd } from "react-icons/md";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2"

const UserIcon = () => {
  const { authStatus, setAuthStatus } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleUserClick = () => {
    navigate('/user');
  };

  const handleWatchLaterClick = () => {
    navigate('/favorite');
  }


  const handleHelpCenterClick = () => {
    navigate('/help-center');
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setAuthStatus({
          checking: false,
          loggedIn: false,
          role: null,
          avatar: null,
        });
        navigate('/');
      } else {
        console.error('Error logging out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const renderUserIcon = () => {
    if (authStatus.checking) {
      return <div><Loading/></div>;
    }

    if (!authStatus.loggedIn) {
      return (
        <div className={styles.userContainer} ref={dropdownRef}>
          <div className={styles.userIcon} onClick={toggleDropdown}>
            <img src={guestIcon} alt="Guest Icon" />
          </div>
          <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
            <button onClick={handleLoginClick} className={styles.loginButton}>
              <FaUser className={styles.icon} /> Login
            </button>
          </div>
        </div>
      );
    }

    const handleImageError = (event) => {
      event.target.src = userIcon;
    };

    const userAvatar = authStatus.avatar || userIcon;

    if (authStatus.role === 'admin') {
      return (
        <div className={styles.userContainer} ref={dropdownRef}>
          <div className={styles.userIcon} onClick={toggleDropdown}>
            <img src={adminIcon} alt="Admin Icon" className={styles.adminpic} onError={handleImageError} />
          </div>
          <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
            <button onClick={handleAdminClick} className={styles.adminButton}>
              <FaUser className={styles.icon} /> Admin Panel
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <FaSignOutAlt className={styles.logouticon} /> Logout
            </button>
          </div>
        </div>
      );
    }

    if (authStatus.role === 'user') {
      return (
        <div className={styles.userContainer} ref={dropdownRef}>
          <div className={styles.userIcon} onClick={toggleDropdown}>
            <img src={userAvatar} alt="User Icon" onError={handleImageError} />
          </div>
          <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
            <button onClick={handleUserClick} className={styles.userButton}>
              <FaUser className={styles.icon} /> User Profile
            </button>
            <button onClick={handleWatchLaterClick} className={styles.watchlaterButton}>
              <MdBookmarkAdd className={styles.watchlatericon} /> Watch Later
            </button>
            <button onClick={handleHelpCenterClick} className={styles.watchlaterButton}>
              <HiMiniQuestionMarkCircle className={styles.watchlatericon} /> Help Center
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <FaSignOutAlt className={styles.logouticon} /> Logout
            </button>
          </div>
        </div>
      );
    }
  };

  return renderUserIcon();
};

export default UserIcon;
