import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRouter from './routes/AppRoutes';
import Header from './components/public/Header/Header';
import { AuthProvider } from './components/auth/AuthContext';
import Notification from './components/public/Notification/Notification';

function App() {
  return (
    <AuthProvider>
      <Notification />
      <Router>
        <div className="App">
          <Header />
          <div className="content">
            <AppRouter />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
