import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import fantaImage from '../../assets/images/fanta.png';
import userIcon from '../../assets/images/user.png';
import guestIcon from '../../assets/images/guest.png';
import adminIcon from '../../assets/images/admin.jpg';
import styles from '../../assets/styles/fanta.module.css';
import { AuthContext } from '../auth/AuthContext';

const FantaLogo = () => {
  const { authStatus, setAuthStatus } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleUserClick = () => {
    navigate('/user');
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setAuthStatus({
          checking: false,
          loggedIn: false,
          role: null,
        });
        navigate('/');
      } else {
        console.error('Error logging out:', data.error);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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

  const toggleDropdown = (event) => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const renderUserIcon = () => {
    if (authStatus.checking) {
      return <div>Loading...</div>;
    }

    if (!authStatus.loggedIn) {
      return (
        <div className={styles.userContainer} ref={dropdownRef}>
        <div className={styles.userIcon} onClick={toggleDropdown}>
        <img src={guestIcon} alt="Guest Icon" />
        </div>
        <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
          <button onClick={handleLoginClick} className={styles.loginButton}>Login</button>
        </div>
      </div>
      );
    }

    if (authStatus.role === 'admin') {
      return (
        <div className={styles.userContainer} ref={dropdownRef}>
          <div className={styles.userIcon} onClick={toggleDropdown}>
            <img src={adminIcon} alt="Admin Icon" className={styles.adminpic}/>
          </div>
          <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
            <button onClick={handleAdminClick} className={styles.adminButton}>Admin Panel</button>
            <button onClick={handleLogout} className={styles.loginButton}>Logout</button>
          </div>
        </div>
      );
    }

    if (authStatus.role === 'user') {
      return (
        <div className={styles.userContainer} ref={dropdownRef}>
          <div className={styles.userIcon} onClick={toggleDropdown}>
            <img src={userIcon} alt="User Icon" />
          </div>
          <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
            <button onClick={handleUserClick} className={styles.userButton}>User Profile</button>
            <button onClick={handleLogout} className={styles.loginButton}>Logout</button>
          </div>
        </div>
      );
    }
  };

  return (
    <header className={styles.header}>
      <a href="/">
        <img src={fantaImage} className={styles.fanta} alt="Fanta" />
      </a>
      {renderUserIcon()}
    </header>
  );
};

export default FantaLogo;
