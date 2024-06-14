import React, { useState } from 'react';
import styles from './admin.module.css';
import LeftSidebar from '../public/LeftSidebar/LeftSidebar';
import RightSidebar from '../public/RightSidebar/RightSidebar';
import CreateGenre from './CreateGenre';
import CreateMovie from './CreateMovie';
import UpdateMovie from './UpdateMovie';
import SeeProfile from './Profile';

const AdminFeatures = () => {
    const [currentFunction, setCurrentFunction] = useState('');

    const renderFunction = () => {
        switch (currentFunction) {
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
                <LeftSidebar setCurrentFunction={setCurrentFunction} />
                <div className={styles['admin-content']}>
                    {renderFunction()}
                </div>
                <RightSidebar />
            </div>
        </section>
    );
};

export default AdminFeatures;
