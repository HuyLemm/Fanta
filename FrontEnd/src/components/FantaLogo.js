import React, { useState } from 'react';
import fantaImage from '../assets/images/fanta.png';
import styles from '../assets/styles/fanta.module.css';

const Logofanta = () => {



  return (
    <header className={styles.header}>
      <a href="/home">
        <img src={fantaImage} className={styles.img} alt="Fanta" />
      </a>
      <div className={styles.but}>
        <a href="login">Login</a>
      </div>
    </header>
  );
};

export default Logofanta;
