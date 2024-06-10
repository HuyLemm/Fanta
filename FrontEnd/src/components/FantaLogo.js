import React from 'react';
import fantaImage from '../assets/images/fanta.png';
import styles from '../assets/styles/fanta.module.css';
const Logofanta = () => {
  return (
    <section className={styles['logo image, logo']}>
      <div className="Fanta">
        <img src={fantaImage} alt="Fanta" />
     </div>
    </section>
  );
};

export default Logofanta;