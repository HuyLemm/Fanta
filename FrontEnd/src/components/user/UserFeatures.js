import React, { useState } from 'react';
import styles from './user.module.css';
import LeftSidebar from './LeftSideBar/LeftSideBarUser';
import RightSidebar from '../public/RightSidebar/RightSidebar';
import SeeProfile from './Profile';

const AdminFeatures = () => {
    const [currentFunction, setCurrentFunction] = useState('');

    const renderFunction = () => {
        switch (currentFunction) {
            case 'Profile':
                return <SeeProfile />;
            default:
                return <SeeProfile />;
        }
    };

    return (
        <section className={styles['user-features']}>
            <div className={styles['user-container']}>
                <LeftSidebar setCurrentFunction={setCurrentFunction} />
                <div className={styles['user-content']}>
                    {renderFunction()}
                </div>
                <RightSidebar />
            </div>
        </section>
    );
};

export default AdminFeatures;
