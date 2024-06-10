import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './assets/styles/app.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/RegisterPage';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import HomePage from './pages/HomePage';
import Header from './components/Header';

function App() {
    return (
        <Router>
            <div className="App">
                <Header /> 
                <nav>
                    <ul>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/signup">Sign Up</Link>
                        </li>
                        <li>
                            <Link to="/home">Home</Link> 
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                    <Route exact path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/home" element={<HomePage />} /> 
                </Routes>
            </div>
        </Router>
    );
}

export default App;
