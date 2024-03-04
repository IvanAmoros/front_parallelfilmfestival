import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  } else if (!user.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
