import React from 'react';
import RegisterForm from './RegisterForm/RegisterForm';
import styles from './RegisterPage.module.css';
import Notification from '../../components/public/Notification/Notification';

const RegisterPage = () => {
    return (
        <div className={styles.registerPage}>
            <Notification />
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
