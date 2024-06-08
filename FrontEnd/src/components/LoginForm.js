import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import hook useNavigate
import styles from '../assets/styles/Login.module.css';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { setCookie, getCookie } from '../utils/Cookies';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate
  
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
          navigate('/Home'); // Redirect to Home page
        } else {
          const errorMessage = await response.text();
          setMessage(errorMessage);
          setPassword('');  // Clear the password field on error
        }
      } catch (error) {
        console.error('Error during login:', error);
        setMessage('An error occurred. Please try again later.');
        setPassword('');  // Clear the password field on error
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
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Password</label>
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

