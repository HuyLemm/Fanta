import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import Loading from '../../public/LoadingEffect/Loading';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(20);

    const navigate = useNavigate();


    useEffect(() => {
        let countdown;
        if (step === 2 && timer > 0) {
            countdown = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(countdown);
    }, [step, timer]);

    // chức năng cho server duyệt email nếu quên mật khảu
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json(); 
            if (response.ok) {
                setMessage(data);
                setIsCodeSent(true);
                setTimer(20);
                setStep(2);
            } else {
                setMessage(data);
                setEmail('');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // chức năng cho server duyệt code được gửi đến gmail 
    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/auth/verify-forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, verificationCode }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data);
                setStep(3);
            } else {
                setMessage(data);
                setVerificationCode('');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // chức năng cho server gửi lại mã code khi hết hạn
    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/auth/resend-forgot', {
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

    // chức năng cho server thay đổi mật khảu
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/reset-password', {
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
                navigate('/login');
            } else {
                setNewPassword('');
                setConfirmPassword('');
                setMessage(message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className = {styles.forgotpasswordPage}>
            <section className={styles['forgot-password-section']}>
                {isLoading && (
                    <div className={styles['loading-container']}>
                        <Loading className={styles['loading-icon']} />
                    </div>
                )}
                {step === 1 && (
                    <form className={styles['forgot-password-form']} onSubmit={handleEmailSubmit}>
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
                        <button type="submit" className={styles['button']}>Send Verification Code</button>
                        {message && <p className={styles['message']}>{message}</p>}
                    </form>
                )}
                {step === 2 && (
                    <form className={styles['forgot-password-form']} onSubmit={handleCodeSubmit}>
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
                            <button type="submit" className={styles['button']}>Verify</button>

                            {timer > 0 ? (
                                <p className={styles['timer']}>Code expires in: {timer}s</p>
                            ) : (
                                <button type="button" className={styles['button']} onClick={handleResendCode}>Resend Code</button>
                            )}

                            {message && <p className={styles['message']}>{message}</p>}
                    </form>
                )}
                {step === 3 && (
                    <form className={styles['forgot-password-form']} onSubmit={handlePasswordReset}>
                        <h1>Reset Password</h1>
                        <div className={styles['inputbox']}>
                            <ion-icon name="lock-closed-outline"></ion-icon>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <label>New Password</label>

                            <span
                                className={styles['show-password']}
                                onClick={() => setShowNewPassword(!showNewPassword)} 
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <div className={styles['inputbox']}>
                            <ion-icon name="lock-closed-outline"></ion-icon>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <label>Confirm Password</label>

                            <span
                                className={styles['show-password']}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <button type="submit" className={styles['button']}>Reset Password</button>
                        {message && <p className={styles['message']}>{message}</p>}
                    </form>
                )}
                {step === 4 && (
                    <div className={styles['message']}>
                        <h1>{message}</h1>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ForgotPassword;