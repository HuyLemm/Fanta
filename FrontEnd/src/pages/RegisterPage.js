import React from 'react';
import RegisterForm from '../components/auth/Register/RegisterForm';
import styles from './loginPage.module.css';

const RegisterPage = () => {
    return (
        <div className={styles.loginPage}>
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
