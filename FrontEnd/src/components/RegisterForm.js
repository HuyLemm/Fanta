import React, { useState } from 'react';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import styles from '../assets/styles/Register.module.css';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data);
            } else {
                setMessage(data);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <section className={styles['register-section']}>
            <form className={styles['register-form']} onSubmit={handleSubmit}>
                <h1>Register</h1>
                <div className={styles['inputbox']}>
                    <ion-icon name="mail-outline"></ion-icon>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Email</label>
                </div>

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

                <div className={styles['inputbox']}>
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label>Confirm Password</label>
                </div>

                <button type="submit" className={styles['button2']}>Sign Up</button>

                {message && <p className={styles['message']}>{message}</p>}
            </form>
        </section>
    );
};

export default RegisterForm;
