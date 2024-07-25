// HelpCenter.js
import React from 'react';
import styles from './HelpCenter.module.css';

const HelpCenter = () => {
    return (
        <div className={styles.helpCenterPage}>
            <div className={styles.helpCenterText}>Help Center</div>
            <div className={styles.content}>
                <h1>How can we help?</h1>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Type a question, topic or issue"
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.recommended}>
                    <h2>Recommended for you:</h2>
                    <ul>
                        <li><a href="#">How to keep your account secure</a></li>
                        <li><a href="#">Parental controls on Netflix</a></li>
                        <li><a href="#">How to change your plan</a></li>
                    </ul>
                </div>
                <div className={styles.explore}>
                    <p>Explore Topics</p>
                    <div className={styles.arrow}>↓</div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
