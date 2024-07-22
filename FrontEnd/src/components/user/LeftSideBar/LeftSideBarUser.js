import React from 'react';
import styles from './LeftSideBarUser.module.css';
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdBookmarkAdd } from "react-icons/md";
import { FaUser, FaRegClock} from 'react-icons/fa';


const LeftSidebar = ({ setCurrentFunction }) => {
    return (
        <div className={styles.sidebar}>
            <button onClick={() => setCurrentFunction('Back to Fanta')} className={styles.backButton}><IoIosArrowRoundBack className={styles.backIcon} /> Back to Fanta</button>
            <button onClick={() => setCurrentFunction('Profile')} className={styles.accountButton}><FaUser className={styles.accountIcon} /> My Account</button>
            <button onClick={() => setCurrentFunction('My History')} className={styles.historyButton}><FaRegClock className={styles.historyIcon} /> History</button>
            <button onClick={() => setCurrentFunction('Watch Later')} className={styles.watchlaterButton}><MdBookmarkAdd className={styles.watchlaterIcon} /> Watch Later</button>
        </div>
    );
};

export default LeftSidebar;
