import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Protected Pages
import Dashboard from '../pages/Dashboard';

// Components
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        <Route 
          path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />} 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Placeholder routes - will be implemented next */}
        <Route path="/products" element={<PrivateRoute><div>Products Page (Coming Soon)</div></PrivateRoute>} />
        <Route path="/receipts" element={<PrivateRoute><div>Receipts Page (Coming Soon)</div></PrivateRoute>} />
        <Route path="/delivery" element={<PrivateRoute><div>Delivery Page (Coming Soon)</div></PrivateRoute>} />
        <Route path="/transfer" element={<PrivateRoute><div>Transfer Page (Coming Soon)</div></PrivateRoute>} />
        <Route path="/adjustment" element={<PrivateRoute><div>Adjustment Page (Coming Soon)</div></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><div>History Page (Coming Soon)</div></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><div>Settings Page (Coming Soon)</div></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><div>Profile Page (Coming Soon)</div></PrivateRoute>} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
