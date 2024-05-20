// import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import LoginModal from './LoginModal';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginModal />;
  }

  return children;
};

export default ProtectedRoute;
