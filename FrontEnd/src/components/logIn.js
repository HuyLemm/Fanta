import React, { useState } from 'react';
import '../Style/logIn.css';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
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
            console.error('Error during login:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="inputbox">
                    <ion-icon name="mail-outline"></ion-icon>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>Username</label>
                </div>

                <div className="inputbox">
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Password</label>
                </div>

                <div className="forget">
                    <label>
                        <input type="checkbox" />
                        Remember Me
                    </label>
                    <a href="">Forget Password</a>
                </div>

                <button type="submit">Log in</button>

                <div className="register">
                    <p>Don't have an account <a href="">Register</a></p>
                </div>

                <div className="social-login">
                    <p>Or log in with:</p>
                    <button type="button" className="google-login">
                        <FaGoogle />
                    </button>
                    <button type="button" className="facebook-login">
                        <FaFacebookF />
                    </button>
                    <button type="button" className="twitter-login">
                        <FaTwitter />
                    </button>
                </div>

                {message && <p className="message">{message}</p>}
            </form>
        </section>
    );
};

export default Login;
