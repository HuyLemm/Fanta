import React, { useState } from 'react';
import styles from './user.module.css';
import LeftSidebar from './LeftSideBar/LeftSideBarUser';
import SeeProfile from './Profile';

const UserFeatures = () => {
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
            </div>
        </section>
    );
};

export default UserFeatures;
