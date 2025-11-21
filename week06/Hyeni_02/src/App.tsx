import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css'
import { MainPage } from './pages/MainPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MyPage } from './pages/MyPage';
import { GoogleCallbackPage } from './pages/GoogleCallbackPage';

// 1. 신규 페이지 임포트
import { LpListPage } from './pages/LpListPage';
import { LpDetailPage } from './pages/LpDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />, 
    children: [
      {
        index: true,
        element: <Navigate to="/lps" replace /> 
      },
      {
        path: 'lps',
        element: <LpListPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'signup',
        element: <SignupPage />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'mypage',
            element: <MyPage />
          },
          {
            path: 'lp/:lpid',
            element: <LpDetailPage />
          },
        ]
      }
    ]
  },
  {
    path: '/v1/auth/google/callback', 
    element: <GoogleCallbackPage />
  },
]);

export function App() {
  return (
    <RouterProvider router={router} />
  )
}