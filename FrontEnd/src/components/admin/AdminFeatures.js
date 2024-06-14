import React, { useState } from 'react';
import styles from '../../assets/styles/admin.module.css';
import LeftSidebar from '../public/LeftSidebar';
import RightSidebar from '../public/RightSidebar';
import CreateGenre from './CreateGenre';
import CreateMovie from './CreateMovie';
import UpdateMovie from './UpdateMovie';

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
                return <p>Please select a function to perform.</p>;
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
