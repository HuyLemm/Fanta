import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordForm from '../components/auth/ForgotPassword/ForgotPasswordForm';
import AdminFeatures from '../components/admin/AdminFeatures';
import ProtectedRoute from '../components/auth/CheckRole';
import UserFeatures from '../components/user/UserFeatures';
import MovieDetail from '../pages/MovieDetail';

function AppRouter() {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />


        {/* Authentication Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage  />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />

        {/* Authenticated Routes */}

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminFeatures /></ProtectedRoute>} />

        {/* <Route path="/admin/add-genre" element={<checkRole role="admin"><AddGenre /></checkRole>} />
        <Route path="/admin/add-movie" element={<checkRole role="admin"><AddMovie /></checkRole>} />
        <Route path="/admin/update-movie" element={<checkRole role="admin"><UpdateMovie /></checkRole>} /> */}

        {/* User Routes */}
        <Route path="/user" element={<ProtectedRoute role="user"><UserFeatures /></ProtectedRoute>} />
        {/* <Route path="/user" element={<checkRole role="user"><HomePage /></checkRole>} />
        <Route path="/profile" element={<checkRole role="user"><ViewProfile /></checkRole>} />
        <Route path="/profile/update" element={<checkRole role="user"><UpdateProfile /></checkRole>} /> */}
      </Routes>
  );
}

export default AppRouter;
