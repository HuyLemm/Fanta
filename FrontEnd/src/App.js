import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './assets/styles/app.css';
import AppRouter from './routes/AppRoutes';
import Logofanta from './components/FantaLogo';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
    <div className="App">   
      <Logofanta />  
      <div className="content">
        <AppRouter />
      </div>
    </div>
    </Router>
  );
}

export default App;
