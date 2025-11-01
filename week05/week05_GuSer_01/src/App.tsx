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

// publicRoutes: 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      // ✅ 자식 경로는 상대 경로로!
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
];

// protecteRoutes: 인증이 필요한 라우트
const protecteRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtecteLayout />,
    children: [
      { path: 'my', element: <MyPage /> },
    ],
  },
];

// ✅ 404 캐치용 와일드카드 라우트 추가
const router = createBrowserRouter([
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
