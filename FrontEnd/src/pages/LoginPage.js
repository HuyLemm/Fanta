import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    const handleLogin = () => {
    };

    return (
        <div className="login-page">
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};

export default LoginPage;
