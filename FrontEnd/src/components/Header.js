import React from 'react';
import styles from '../assets/styles/header.module.css';
import fantaImage from '../assets/images/fanta.png';

const Header = () => {
    return (
        <header className={styles.header}>
            <a href="/Home">
                <img src={fantaImage} className={styles.img} alt="Header Image" />
            </a>
        </header>
    );
};

export default Header;