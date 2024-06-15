import React from 'react';
import styles from './LeftSideBarUser.module.css';

const LeftSidebar = ({ setCurrentFunction }) => {
    return (
        <div className={styles.sidebar}>
            <h2>User Functions</h2>
            <button onClick={() => setCurrentFunction('profile')} className={styles.btn}>Profile</button>
        </div>
    );
};

export default LeftSidebar;
