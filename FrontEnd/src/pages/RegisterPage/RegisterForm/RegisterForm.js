import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { setCookie } from '../../../utils/Cookies';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Loading from '../../../components/public/LoadingEffect/Loading';
import Notification, {notifyError, notifySuccess,notifyWarning,notifyInfo} from '../../../components/public/Notification/Notification';

const RegisterForm = () => {
    const [email, setEmail] = useState(''); 
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const [verificationCode, setVerificationCode] = useState(''); 
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 
    const [timer, setTimer] = useState(20); 
    const navigate = useNavigate(); 

    useEffect(() => {
        let countdown;
        if (isCodeSent && timer > 0) {
            countdown = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(countdown);
    }, [isCodeSent, timer]);

    // Function to handle registration form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password, confirmPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                notifySuccess(data);
                setIsCodeSent(true);
                setTimer(20);
            } else {
                notifyWarning(data);
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            notifyError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle email verification code submission
    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch('http://localhost:5000/auth/verify-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password, code: verificationCode }),
            });

            const data = await response.json();
            if (response.ok) {
                notifySuccess(data.message);
                setCookie('jwt', data.token, 1);
                navigate('/');
            } else {
                notifyWarning(data);
                setVerificationCode('');
            }
        } catch (error) {
            notifyError('An error occurred. Please try again later.');
            setVerificationCode('');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle resending the verification code
    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/auth/resend-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                notifySuccess(data);
                setTimer(20);
            } else {
                notifyWarning(data);
            }
        } catch (error) {
            notifyError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles['register-section']}>
            <Notification />
            {/* Loading overlay */}
            {isLoading && (
                <div className={styles['loading-container']}>
                    <Loading className={styles['loading-icon']} />
                </div>
            )}
            {/* Form for registration */}
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

                    <button type="submit" className={styles['button2']}>Sign Up</button>

                </form>
            ) : (
                // Form for email verification
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

                </form>
            )}
        </section>
    );
};

export default RegisterForm;
