import React from 'react';
import styles from './LeftSideBarUser.module.css';

const LeftSidebar = ({ setCurrentFunction }) => {
    return (
        <div className={styles.sidebar}>
            <button onClick={() => setCurrentFunction('Profile')} className={styles.btn}>Profile</button>
            <button onClick={() => setCurrentFunction('My History')} className={styles.btn}>My History</button>
        </div>
    );
};

export default LeftSidebar;
