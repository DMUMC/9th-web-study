// src/components/ProtectedRoute.tsx
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AutoContext';
import { LoginConfirmModal } from './LoginConfirmModal';

export const ProtectedRoute = () => {
  const { token } = useAuth(); 
  const isAuthenticated = !!token;
  
  const location = useLocation();
  const redirectPath = location.pathname + location.search;

  if (!isAuthenticated) {
    return <LoginConfirmModal redirectPath={redirectPath} />;
  }

  return <Outlet />;
};