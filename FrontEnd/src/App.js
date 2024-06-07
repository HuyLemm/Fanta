import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './assets/styles/app.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/signup">Sign Up</Link>
                        </li>
                        <li>
                            <Link to="/home">Home</Link> {/* Thêm link đến homepage */}
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route exact path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/home" element={<HomePage />} /> {/* Thêm route cho homepage */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
