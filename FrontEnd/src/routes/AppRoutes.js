// src/routes/AppRouter.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import HomePage from '../pages/HomePage';
// import MovieCategory from '../pages/MovieCategory';
// import MovieSearch from '../pages/MovieSearch';
// import MovieDetails from '../pages/MovieDetails';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import AdminForm from '../components/AdminForm';
// import EditProfile from '../pages/EditProfile';
// import Favorites from '../pages/Favorites';
// import MoviePlayer from '../pages/MoviePlayer';
// import MovieReview from '../pages/MovieReview';
// import MovieComments from '../pages/MovieComments';

// function PrivateRoute({ children }) {
//   const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
//   return isAuthenticated ? children : <Navigate to="/login" />;
// }

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path= "/admin" element={<AdminForm />} />
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/movies" element={<MovieCategory />} />
        <Route path="/search" element={<MovieSearch />} />
        <Route path="/movies/:id" element={<MovieDetails />} /> */}
        
        {/* Authentication Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage  />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />

        {/* Authenticated Routes */}
        {/* <Route path="/profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
        <Route path="/movies/:id/play" element={<PrivateRoute><MoviePlayer /></PrivateRoute>} />
        <Route path="/movies/:id/review" element={<PrivateRoute><MovieReview /></PrivateRoute>} />
        <Route path="/movies/:id/comments" element={<PrivateRoute><MovieComments /></PrivateRoute>} /> */}
      </Routes>
    </Router>
  );
}

export default AppRouter;
