import React, { useState, useRef, useEffect } from 'react';
import styles from '../assets/styles/footer.module.css';

const Footer = () => {
    return(
        <footer>
            <div class={styles.footer}>
                copyright &#169; 2024 Huy Lemm/Ethan Nguyen/Ekusos. All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;