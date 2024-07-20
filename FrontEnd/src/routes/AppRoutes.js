// AppRouter.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ForgotPasswordForm from '../pages/LoginPage/ForgotPassword/ForgotPasswordForm';
import AdminFeatures from '../components/admin/AdminFeatures';
import ProtectedRoute from '../components/auth/CheckRole';
import UserFeatures from '../components/user/UserFeatures';
import MovieDetail from '../pages/MovieDetail/MovieDetail';
import SearchResults from '../pages/SearchResults/SearchResults';
import Categories from '../pages/Categories/Categories';
import Streaming from '../pages/Streaming/Streaming';
import Favorite from '../pages/Favorite/Favorite';
import Test from '../pages/Tests/Test';

function AppRouter({ currentFunction, setCurrentFunction }) {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage currentFunction={currentFunction} setCurrentFunction={setCurrentFunction}/>} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/genre/:genreName" element={<Categories />} />
        <Route path="/streaming/:id" element={<Streaming />} />
        <Route path="/test" element={<Test />} />

        {/* Authentication Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage  />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />

        {/* Authenticated Routes */}

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminFeatures /></ProtectedRoute>} />

        {/* User Routes */}
        <Route path="/user" element={<ProtectedRoute role="user"><UserFeatures currentFunction={currentFunction} setCurrentFunction={setCurrentFunction} /></ProtectedRoute>} />
        <Route path="/favorite" element={<ProtectedRoute role="user"><Favorite /></ProtectedRoute>} />
      </Routes>
  );
}

export default AppRouter;
