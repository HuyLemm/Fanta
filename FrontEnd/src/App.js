import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './assets/styles/app.css';
import AppRouter from './routes/AppRoutes';
import Logofanta from './components/public/FantaLogo/FantaLogo';
import { AuthProvider } from './components/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Logofanta />
          <div className="content">
            <AppRouter />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
