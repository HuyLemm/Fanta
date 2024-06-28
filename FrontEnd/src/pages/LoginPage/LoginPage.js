import React from 'react';
import LoginForm from './LoginForm/LoginForm';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    return (
        // Khu vực trang đăng nhập
        <div className={styles.loginPage}>
            <LoginForm /> {/* Form đăng nhập */}
        </div>
    );
};

export default LoginPage;
