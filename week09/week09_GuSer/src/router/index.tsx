import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './ProtectedRoute';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import LPListPage from '../pages/LPListPage';
import LPDetailPage from '../pages/LPDetailPage';
import CreateLPPage from '../pages/CreateLPPage';
import EditLPPage from '../pages/EditLPPage';
import MyPage from '../pages/MyPage';
import CartPage from '../pages/CartPage';
import NotFoundPage from '../pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'lps',
        element: <LPListPage />,
      },
      {
        path: 'lp/:lpId',
        element: <LPDetailPage />,
      },
      {
        path: 'create-lp',
        element: (
          <ProtectedRoute>
            <CreateLPPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'edit-lp/:lpId',
        element: (
          <ProtectedRoute>
            <EditLPPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'mypage',
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

