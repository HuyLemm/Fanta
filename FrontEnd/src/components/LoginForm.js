import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../assets/styles/Login.module.css';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import { setCookie, getCookie } from '../utils/Cookies';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 
  
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

        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          setCookie('jwt', data.token, 1);
          navigate('/Home'); 
        } else {
          const errorMessage = await response.text();
          setMessage(errorMessage);
          setPassword('');  
        }
      } catch (error) {
        console.error('Error during login:', error);
        setMessage('An error occurred. Please try again later.');
        setPassword('');  
      }
    };
  
    return (
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
                        type={showPassword ? "text" : "password"}// Toggle input type based on showPassword state
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Password</label>

                    <span
                        className={styles['show-password']} // Ensure className is set correctly
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <div className={styles['forget']}>
                    <label>
                        <input type="checkbox" />
                        Remember Me
                    </label>
                </div>

                <div className={styles['forget1']}>
                    <a href="">Forget Password?</a>
                </div>

                <button type="submit" className={styles['button1']}>Log in</button>

                <div className={styles['register']}>
                    <p>Don't have an account? <a href="/signup">Register</a></p>
                </div>

                <div className={styles['social-login']}>
                    <p>Or log in with:</p>
                    <button type="button" className={styles['google-login']}>
                        <FaGoogle />
                    </button>
                    <button type="button" className={styles['facebook-login']}>
                        <FaFacebookF />
                    </button>
                    <button type="button" className={styles['twitter-login']}>
                        <FaTwitter />
                    </button>
                </div>

                {message && <p className={styles['message']}>{message}</p>}
            </form>
        </section>
    );
};

export default LoginForm;

