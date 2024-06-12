import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fantaImage from '../assets/images/fanta.png';
import userIcon from '../assets/images/user.png'; 
import styles from '../assets/styles/fanta.module.css';

const Logofanta = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLoginClick = () => {
    navigate('/login');
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

  return (
    <header className={styles.header}>
      <a href="/">
        <img src={fantaImage} className={styles.fanta} alt="Fanta" />
      </a>
      <div className={styles.userContainer} ref={dropdownRef}>
        <div className={styles.userIcon} onClick={toggleDropdown}>
          <img src={userIcon} alt="User Icon" />
        </div>
        <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
          <button onClick={handleLoginClick} className={styles.loginButton}>Login</button>
        </div>
      </div>
    </header>
  );
};

export default Logofanta;
