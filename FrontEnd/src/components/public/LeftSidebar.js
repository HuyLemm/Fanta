import React from 'react';
import styles from '../../assets/styles/LeftSidebar.module.css';

const LeftSidebar = ({ setCurrentFunction }) => {
    return (
        <div className={styles.sidebar}>
            <h2>Admin Functions</h2>
            <button onClick={() => setCurrentFunction('createGenre')} className={styles.btn}>Create Genre</button>
            <button onClick={() => setCurrentFunction('createMovie')} className={styles.btn}>Create Movie</button>
            <button onClick={() => setCurrentFunction('updateMovie')} className={styles.btn}>Update Movie</button>
        </div>
    );
};

export default LeftSidebar;
