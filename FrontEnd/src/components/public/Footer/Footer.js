import React from 'react';
import styles from './footer.module.css';

const Footer = () => {
  return (
        <footer className={styles.footer}>
            <div>
                copyright &#169; 2024 Huy Lemm/Paoi/Ethan Nguyen/Ekusos. All Rights Reserved
            </div>
            <div className={styles.up}>
              <a href="/" className={styles.more}>
                More about US
              </a>
            </div>
        </footer>
  );
};

export default Footer;