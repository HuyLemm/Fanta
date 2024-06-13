import React from 'react';
import styles from '../../assets/styles/RightSidebar.module.css';

const RightSidebar = ({ message }) => {
    return (
        <div className={styles.sidebar}>
            <h2>Status</h2>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default RightSidebar;
