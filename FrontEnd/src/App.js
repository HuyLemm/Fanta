import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './assets/styles/app.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/RegisterPage';
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
                    </ul>
                </nav>
                <Routes>
                    <Route exact path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
