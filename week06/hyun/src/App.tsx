import {
    RouterProvider,
    createBrowserRouter,
    type RouteObject,
} from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';
import SearchPage from './pages/SearchPage';
import LpDetailPage from './pages/LpDetailPage';
import LpCreatePage from './pages/LpCreatePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// publicRoutes: 인증이 필요하지 않은 라우트
const publicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <HomeLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Homepage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'signup', element: <SignupPage /> },
            { path: 'search', element: <SearchPage /> },
            { path: 'lp/new', element: <LpCreatePage /> },
            { path: 'lp/:lpId', element: <LpDetailPage /> },
            {
                path: 'v1/auth/google/callback',
                element: <GoogleLoginRedirectPage />,
            },
        ],
    },
];
// protectedRoutes: 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
    {
        path: '/',
        element: <ProtectedLayout />,
        errorElement: <NotFound />,
        children: [
            {
                path: 'my',
                element: <MyPage />,
            },
        ],
    },
];
const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            {import.meta.env.DEV && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}

export default App;
