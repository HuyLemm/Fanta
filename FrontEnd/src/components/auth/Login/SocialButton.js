import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import styles from './Login.module.css';

const GmailButton = ({ setMessage, setCookie, navigate }) => {
    const handleGoogleLoginSuccess = async (tokenResponse) => {
        try {
            const response = await fetch('http://localhost:5000/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: tokenResponse.credential }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setCookie('jwt', data.token, 1);
                navigate('/');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => {
            setMessage('Failed to login with Google. Please try again later.');
        },
        redirect_uri: 'http://localhost:3000' 
    });

    return (
        <div className={styles['social-login']}>
            <p>Or log in with:</p>
            <button type="button" className={styles['google-login']} onClick={() => googleLogin()}>
                <FaGoogle />
            </button>
            <button type="button" className={styles['facebook-login']} onClick={() => googleLogin()}>
                <FaFacebookF/>
            </button>
            <button type="button" className={styles['twitter-login']} onClick={() => googleLogin()}>
                <FaTwitter />
            </button>
        </div>
    );
};

export default GmailButton;
