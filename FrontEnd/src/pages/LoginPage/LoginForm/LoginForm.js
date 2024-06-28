import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './LoginForm.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { setCookie } from '../../../utils/Cookies';
import SocialButton from '../SocialButton/SocialButton';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

    // Kiểm tra localStorage để tự động điền thông tin nếu người dùng đã lưu trước đó
    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    // Gửi thông tin đăng nhập đến server để xác thực
    const handleSubmit = async (e) => {
        e.preventDefault();
  
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setCookie('jwt', data.token, 1); // Lưu token vào cookie
                if (rememberMe) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                }
                navigate('/'); // Chuyển hướng người dùng về trang chủ
            } else {
                setMessage(data);
                setPassword('');  
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
            setPassword('');  
        }
    };

    return (
        // Khu vực đăng nhập
        <section className={styles['login-section']}>
            <form className={styles['login-form']} onSubmit={handleSubmit}>
                <h1>Login</h1> {/* Tiêu đề */}
                <div className={styles['inputbox']}>
                    <ion-icon name="mail-outline"></ion-icon>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>Username</label>
                </div>

                <div className={styles['inputbox']}>
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Password</label>
                    <span
                        className={styles['show-password']}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <div className={styles['forget']}>
                    <label>
                        <input 
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        Remember Me
                    </label>
                </div>

                <div className={styles['forget1']}>
                    <a href="/forgot-password">Forget Password?</a>
                </div>

                <button type="submit" className={styles['button1']}>Log in</button>

                <div className={styles['register']}>
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
                
                <SocialButton/>

                {message && <p className={styles['message']}>{message}</p>}
            </form>
        </section>
    );
};

export default LoginForm;
