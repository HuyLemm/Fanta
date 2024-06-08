import React, { useState, useEffect } from 'react';
import styles from '../assets/styles/Register.module.css';
import { setCookie, getCookie } from '../utils/Cookies';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(20);

    useEffect(() => {
        let countdown;
        if (isCodeSent && timer > 0) {
            countdown = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(countdown);
    }, [isCodeSent, timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setPassword(''); // Clear the password field
            setConfirmPassword(''); // Clear the confirmPassword field
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Verification code sent to your email.');
                setIsCodeSent(true);
                setTimer(20);
            } else {
                setMessage(data);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/user/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password, code: verificationCode }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Account created successfully.');
                setCookie('jwt', data.token, 1);
            } else {
                setMessage(data);
            }
        } catch (error) {
            console.error('Error during verification:', error);
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/user/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Verification code resent to your email.');
                setTimer(20);
            } else {
                setMessage(data);
            }
        } catch (error) {
            console.error('Error during resending code:', error);
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles['register-section']}>
            {isLoading && <p className={styles['loading']}>Processing...</p>}
            {!isCodeSent ? (
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
            ) : (
                <form className={styles['register-form']} onSubmit={handleVerify}>
                    <h1>Verify Email</h1>
                    <div className={styles['inputbox']}>
                        <ion-icon name="key-outline"></ion-icon>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                        <label>Verification Code</label>
                    </div>

                    <button type="submit" className={styles['button2']}>Verify</button>

                    {timer > 0 ? (
                        <p className={styles['timer']}>Code expires in: {timer}s</p>
                    ) : (
                        <button type="button" className={styles['button2']} onClick={handleResendCode}>Resend Code</button>
                    )}

                    {message && <p className={styles['message']}>{message}</p>}
                </form>
            )}
        </section>
    );
};

export default RegisterForm;
