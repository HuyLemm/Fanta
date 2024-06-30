import React, { useState } from 'react';
import styles from './AdminFeatures.module.css';
import LeftSidebar from './LeftSidebar/LeftSideBarAdmin';
import CreateGenre from './CreateGenre/CreateGenre';
import CreateMovie from './CreateMovie/CreateMovie';
import UpdateMovie from './UpdateMovie/UpdateMovie';
import SeeProfile from './Profile/Profile';
import EditUser from './EditUser/EditUser';
import Notification from '../../components/public/Notification/Notification';

const AdminFeatures = () => {
    const [currentFunction, setCurrentFunction] = useState('');

    const renderFunction = () => {
        switch (currentFunction) {
            case 'Profile':
                return <SeeProfile />;
            case 'editUsers':
                return <EditUser />;
            case 'createGenre':
                return <CreateGenre />;
            case 'createMovie':
                return <CreateMovie />;
            case 'updateMovie':
                return <UpdateMovie />;
            default:
                return <SeeProfile />;
        }
    };

    return (
        <div className={styles.panelPage}>
            <Notification />
            <section className={styles['admin-features']}>
                <div className={styles['admin-container']}>
                    <div className={styles.sidebar}>
                        <LeftSidebar setCurrentFunction={setCurrentFunction} />
                    </div>
                    <div className={styles['admin-content']}>
                        {renderFunction()}
                    </div>
                </div>
            </section>
        </div> 
    );
};

export default AdminFeatures;
