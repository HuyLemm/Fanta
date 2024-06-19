import React, { createContext, useState, useEffect } from 'react';
import { checkLoginStatus } from '../../utils/Cookies';

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
      const status = await checkLoginStatus();
      setAuthStatus({
        checking: false,
        loggedIn: status.loggedIn,
        role: status.role,
        avatar: status.avatar,
      });
    };

    // Gọi hàm fetchLoginStatus ngay khi component mount
    fetchLoginStatus();

    // Thiết lập polling để kiểm tra trạng thái mỗi 5 giây
    const intervalId = setInterval(fetchLoginStatus, 5000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
