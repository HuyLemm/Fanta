import React, { useState } from 'react';
import fantaImage from '../assets/images/fanta.png';
import styles from '../assets/styles/fanta.module.css';

const Logofanta = () => {
  return (
    <header className={styles.header}>
      <a href="/Home">
        <img src={fantaImage} className={styles.fanta} alt="Fanta" />
      </a>
      <div className={styles.login}>
        <a href="/login">Login</a>
      </div>
    </header>
  );
};

export default Logofanta;
