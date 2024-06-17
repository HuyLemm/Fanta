import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '931447501291-l7e0rl6tumud57mdeed1sm52086ihf8i.apps.googleusercontent.com';


ReactDOM.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <App />
        </GoogleOAuthProvider>

    </React.StrictMode>,
    document.getElementById('root')
);
