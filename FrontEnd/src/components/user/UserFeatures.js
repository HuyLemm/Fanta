// UserFeatures.js
import React from 'react';
import styles from './UserFeatures.module.css';
import LeftSidebar from './LeftSideBar/LeftSideBarUser';
import SeeProfile from './Profile/Profile';
import Notification from '../public/Notification/Notification';
import FullHistory from './FullHistory/FullHistory';

const UserFeatures = ({ currentFunction, setCurrentFunction }) => {
    const renderFunction = () => {
        switch (currentFunction) {
            case 'Profile':
                return <SeeProfile />;
            case 'My History':
                return <FullHistory />;
            default:
                return <SeeProfile />;
        }
    };

    return (
        <div className={styles.panelPage}>
            <Notification />
            <section className={styles['user-features']}>
                <div className={styles['user-container']}>
                    <LeftSidebar setCurrentFunction={setCurrentFunction} />
                    <div className={styles['user-content']}>
                        {renderFunction()}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserFeatures;
