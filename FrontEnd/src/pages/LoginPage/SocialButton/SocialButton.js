import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import styles from './SocialButton.module.css';

const SocialButton = ({ setMessage, setCookie, navigate }) => {
    // Xử lý khi Google login thành công
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
                setCookie('jwt', data.token, 1); // Lưu token vào cookie
                navigate('/'); // Chuyển hướng người dùng về trang chủ
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };

    // Cấu hình Google login
    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => {
            setMessage('Failed to login with Google. Please try again later.');
        },
        redirect_uri: 'http://localhost:3000' 
    });

    return (
        // Khu vực đăng nhập bằng social platform
        <div className={styles['login-form']}>
            <p>Or log in with:</p> {/* Thông báo */}
            <div className={styles['social-login-buttons']}>
                <button type="button" className={`${styles['social-login-button']} ${styles['google-login']}`} onClick={() => googleLogin()}>
                    <FaGoogle /> {/* Nút Google */}
                </button>
                <button type="button" className={`${styles['social-login-button']} ${styles['facebook-login']}`} onClick={() => googleLogin()}>
                    <FaFacebookF /> {/* Nút Facebook */}
                </button>
                <button type="button" className={`${styles['social-login-button']} ${styles['twitter-login']}`} onClick={() => googleLogin()}>
                    <FaTwitter /> {/* Nút Twitter */}
                </button>
            </div>
        </div>
    );
};

export default SocialButton;
