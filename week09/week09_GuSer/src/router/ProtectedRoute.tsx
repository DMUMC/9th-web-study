import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/token';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // 로그인 페이지로 리다이렉트하면서 원래 가려던 경로를 저장
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

