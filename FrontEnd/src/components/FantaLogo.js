import React from 'react';
import { useNavigate } from 'react-router-dom';
import fantaImage from '../assets/images/fanta.png';
import styles from '../assets/styles/fanta.module.css';

const Logofanta = () => {
  const navigate = useNavigate(); // Thêm dòng này

  const handleLoginClick = () => {
    navigate('/login'); // Thêm dòng này
  };

  return (
    <header className={styles.header}>
      <a href="/">
        <img src={fantaImage} className={styles.fanta} alt="Fanta" />
      </a>
      <div className={styles.login}>
        <button onClick={handleLoginClick} className={styles.loginButton}>Login</button>
      </div>
    </header>
  );
};

export default Logofanta;