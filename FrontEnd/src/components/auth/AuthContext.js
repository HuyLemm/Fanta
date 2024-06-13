import React, { createContext, useState, useEffect } from 'react';
import { checkLoginStatus } from '../../utils/Cookies';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    checking: true,
    loggedIn: false,
    role: null,
  });

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const status = await checkLoginStatus();
      setAuthStatus({
        checking: false,
        loggedIn: status.loggedIn,
        role: status.role,
      });
    };

    fetchLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
