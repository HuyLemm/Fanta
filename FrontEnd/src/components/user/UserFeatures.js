// UserFeatures.js
import React from 'react';
import styles from './UserFeatures.module.css';
import LeftSidebar from './LeftSideBar/LeftSideBarUser';
import SeeProfile from './Profile/Profile';
import Notification from '../public/Notification/Notification';
import FullHistory from './FullHistory/FullHistory';
import { useNavigate } from 'react-router-dom';
import WatchLater from './WatchLater/WatchLater';

const UserFeatures = ({ currentFunction, setCurrentFunction }) => {
    const navigate = useNavigate();
    const renderFunction = () => {
        switch (currentFunction) {
            case 'Back to Fanta': 
                navigate('/');
            case 'Profile':
                return <SeeProfile />;
            case 'My History':
                return <FullHistory />;
            case 'Watch Later':
                return <WatchLater />;
            default:
                return <SeeProfile />;
        }
    };

    return (
        <div className={styles.panelPage}>
            <Notification />
            <section className={styles.userfeatures}>
                <div className={styles.usercontainer}>
                    <LeftSidebar setCurrentFunction={setCurrentFunction} />
                    <div className={styles.usercontent}>
                        {renderFunction()}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserFeatures;
