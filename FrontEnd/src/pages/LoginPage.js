import React from 'react';
import LoginForm from '../components/auth/Login/LoginForm';
import styles from './loginPage.module.css';

const LoginPage = () => {


    return (
        <div className={styles.loginPage}>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
