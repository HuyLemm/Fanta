import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './assets/styles/app.css';
import AppRouter from './routes/AppRoutes';
import Logofanta from './components/FantaLogo';

function App() {
  return (
    <Router>
    <div className="App">   
      <Logofanta />  
      <AppRouter />
    </div>
    </Router>
  );
}

export default App;
