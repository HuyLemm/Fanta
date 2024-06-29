import React from 'react';
import LoginForm from './LoginForm/LoginForm';
import styles from './LoginPage.module.css';
import Notification from '../../components/public/Notification/Notification';
const LoginPage = () => {
    return (
        // Khu vực trang đăng nhập
        <div className={styles.loginPage}>
            <Notification/>
            <LoginForm /> {/* Form đăng nhập */}
        </div>
    );
};

export default LoginPage;
