import React, { createContext, useState, useEffect } from 'react';
import { checkLoginStatus, getCookie } from '../../utils/Cookies';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    checking: true,
    loggedIn: false,
    role: null,
    avatar: null,
  });

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const token = getCookie('jwt');
      if (!token) {
        setAuthStatus({
          checking: false,
          loggedIn: false,
          role: null,
          avatar: null,
        });
        return;
      }

      const status = await checkLoginStatus();
      setAuthStatus({
        checking: false,
        loggedIn: status.loggedIn,
        role: status.role,
        avatar: status.avatar,
      });
    };

    fetchLoginStatus();

    const intervalId = setInterval(fetchLoginStatus, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
