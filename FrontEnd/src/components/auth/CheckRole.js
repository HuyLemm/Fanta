import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkLoginStatus } from '../../utils/Cookies';

// Hàm kiểm tra trạng route
const ProtectedRoute = ({ children, role }) => {
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

  if (authStatus.checking) {
    return <div>Loading...</div>;
  }

  if (!authStatus.loggedIn) {
    return <Navigate to="/login" />;
  }

  if (authStatus.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
