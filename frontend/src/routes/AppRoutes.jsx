import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Main Pages
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import ProductForm from '../pages/ProductForm';
import Receipts from '../pages/Receipts';
import Delivery from '../pages/Delivery';
import DeliveryForm from '../pages/DeliveryForm';
import Transfer from '../pages/Transfer';
import Adjustment from '../pages/Adjustment';
import MoveHistory from '../pages/MoveHistory';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Warehouses from '../pages/Warehouses';
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
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        {/* Products */}
        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/products/new" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        <Route path="/products/edit/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        
        {/* Operations */}
        <Route path="/receipts" element={<PrivateRoute><Receipts /></PrivateRoute>} />
        <Route path="/receipts/new" element={<PrivateRoute><DeliveryForm /></PrivateRoute>} />
        <Route path="/receipts/:id" element={<PrivateRoute><DeliveryForm /></PrivateRoute>} />
        
        <Route path="/delivery" element={<PrivateRoute><Delivery /></PrivateRoute>} />
        <Route path="/delivery/new" element={<PrivateRoute><DeliveryForm /></PrivateRoute>} />
        <Route path="/delivery/:id" element={<PrivateRoute><DeliveryForm /></PrivateRoute>} />
        
        <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />
        <Route path="/adjustment" element={<PrivateRoute><Adjustment /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><MoveHistory /></PrivateRoute>} />
        
        {/* Settings & Profile */}
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/warehouses" element={
    <PrivateRoute>
      <Warehouses />
    </PrivateRoute>
  } 
/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
