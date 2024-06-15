import React, { useState } from 'react';
import styles from './admin.module.css';
import LeftSidebar from './LeftSidebar/LeftSideBarAdmin';
import CreateGenre from './CreateGenre';
import CreateMovie from './CreateMovie';
import UpdateMovie from './UpdateMovie';
import SeeProfile from './Profile';
import EditUser from './EditUser';
import RightSidebar from '../public/RightSidebar/RightSidebar';

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
        <section className={styles['admin-features']}>
            <div className={styles['admin-container']}>
                <div className={styles.sidebar}>
                    <LeftSidebar setCurrentFunction={setCurrentFunction} />
                    <div className={styles.logout}>
                        <a href="#">Logout</a>
                    </div>
                </div>
                <div className={styles['admin-content']}>
                    {renderFunction()}
                </div>
                <RightSidebar className={styles['right-sidebar']}/>
            </div>
        </section>
    );
};

export default AdminFeatures;
