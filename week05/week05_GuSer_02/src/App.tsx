// App.tsx
import './App.css';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import NotFoundPage from './pages/NotFoundPage';
import ProtecteLayout from './layouts/ProtectedLayout';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';

// ✅ 1) 최상위(루트) 경로에도 콜백을 직접 매핑 (가장 확실)
const topLevelRoutes: RouteObject[] = [
  { path: '/callback', element: <GoogleLoginRedirectPage /> },
  { path: '/v1/auth/google/callback', element: <GoogleLoginRedirectPage /> }, // ← 여기!
];

// publicRoutes: 인증 없이 접근 가능한 라우트 (기존 유지)
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },

      // (참고) 여기도 남겨둬도 되지만, topLevelRoutes 덕분에 없어도 동작합니다.
      { path: 'callback', element: <GoogleLoginRedirectPage /> },
      { path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage /> },
    ],
  },
];

// protecteRoutes: 인증이 필요한 라우트 (기존 유지)
const protecteRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtecteLayout />,
    children: [{ path: 'my', element: <MyPage /> }],
  },
];

const router = createBrowserRouter([
  ...topLevelRoutes,      // ✅ 가장 먼저 넣어 확실히 매칭
  ...publicRoutes,
  ...protecteRoutes,
  { path: '*', element: <NotFoundPage /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
