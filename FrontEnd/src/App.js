// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRouter from './routes/AppRoutes';
import Header from './components/public/Header/Header';
import { AuthProvider } from './components/auth/AuthContext';
import Notification from './components/public/Notification/Notification';

function App() {
  const [currentFunction, setCurrentFunction] = useState('');

  return (
    <AuthProvider>
      <Notification />
      <Router>
        <div className="App">
          <Header setCurrentFunction={setCurrentFunction} />
          <div className="content">
            <AppRouter currentFunction={currentFunction} setCurrentFunction={setCurrentFunction} />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
