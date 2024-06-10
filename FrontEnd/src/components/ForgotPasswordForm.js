import React, { useState, useEffect } from 'react';
import styles from '../assets/styles/Login.module.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(20);

    useEffect(() => {
        let countdown;
        if (step === 2 && timer > 0) {
            countdown = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(countdown);
    }, [step, timer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/user/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage(data);
                setIsCodeSent(true);
                setTimer(20);
                setStep(2);
            } else {
                setMessage(data);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/user/verifyForgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, verificationCode }),
            });

            if (response.ok) {
                setMessage(data);
                setStep(3);
            } else {
                setMessage(data);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/user/resendForgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data);
                setTimer(20);
            } else {
                setMessage(data);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/user/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }),
            });
            const message = await response.json();
            if (response.ok) {
                setMessage(message);
                setStep(4);
            } else {
                setMessage(message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles['login-section']}>
            {isLoading && <p className={styles['loading']}>Processing...</p>}
            {step === 1 && (
                <form className={styles['login-form']} onSubmit={handleEmailSubmit}>
                    <h1>Forgot Password</h1>
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
                    <button type="submit" className={styles['button2']}>Send Verification Code</button>
                    {message && <p className={styles['message']}>{message}</p>}
                </form>
            )}
            {step === 2 && (
                <form className={styles['login-form']} onSubmit={handleCodeSubmit}>
                    <h1>Verify Code</h1>
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
            {step === 3 && (
                <form className={styles['login-form']} onSubmit={handlePasswordReset}>
                    <h1>Reset Password</h1>
                    <div className={styles['inputbox']}>
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <label>New Password</label>
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
                    <button type="submit" className={styles['button2']}>Reset Password</button>
                    {message && <p className={styles['message']}>{message}</p>}
                </form>
            )}
            {step === 4 && (
                <div className={styles['message']}>
                    <h1>{message}</h1>
                </div>
            )}
        </section>
    );
};

export default ForgotPassword;