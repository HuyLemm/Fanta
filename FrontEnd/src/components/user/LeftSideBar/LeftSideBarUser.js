import React from 'react';
import styles from './LeftSideBarUser.module.css';
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdBookmarkAdd } from "react-icons/md";
import { FaUser, FaRegClock} from 'react-icons/fa';
import { RxActivityLog } from "react-icons/rx";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2"

const LeftSidebar = ({ setCurrentFunction }) => {
    return (
        <div className={styles.sidebar}>
            <button onClick={() => setCurrentFunction('Back to Fanta')} className={styles.backButton}><IoIosArrowRoundBack className={styles.backIcon} /> Back to Fanta</button>
            <button onClick={() => setCurrentFunction('Profile')} className={styles.accountButton}><FaUser className={styles.accountIcon} /> My Account</button>
            <button onClick={() => setCurrentFunction('My History')} className={styles.historyButton}><FaRegClock className={styles.historyIcon} /> History</button>
            <button onClick={() => setCurrentFunction('Watch Later')} className={styles.watchlaterButton}><MdBookmarkAdd className={styles.watchlaterIcon} /> Watch Later</button>
            <button onClick={() => setCurrentFunction('Activity')} className={styles.activityButton}><RxActivityLog className={styles.activityIcon} /> Activity</button>
            <button onClick={() => setCurrentFunction('Help Center')} className={styles.helpcenterButton}><HiMiniQuestionMarkCircle className={styles.helpcenterIcon} /> Help Center</button>

        </div>
    );
};

export default LeftSidebar;
