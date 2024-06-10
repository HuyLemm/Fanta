import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../assets/styles/Login.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { setCookie, getCookie } from '../utils/Cookies';
import SocialButton from './SocialButton';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
  
        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setCookie('jwt', data.token, 1);
                if (rememberMe) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                }
                navigate('/Home'); 
            } else {
                setMessage(data.message);
                setPassword('');  
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
            setPassword('');  
        }
    };

    return(
        <section className={styles['login-section']}>
            <form className={styles['login-form']} onSubmit={handleSubmit}>
                <h1>Login</h1>
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
                    <p>Don't have an account? <a href="/signup">Register</a></p>
                </div>

                <SocialButton/>


                {message && <p className={styles['message']}>{message}</p>}
            </form>
        </section>
    );
};

export default LoginForm;