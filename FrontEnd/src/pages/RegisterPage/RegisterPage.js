import React from 'react';
import RegisterForm from './Register/RegisterForm';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
    return (
        <div className={styles.registerPage}>
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
