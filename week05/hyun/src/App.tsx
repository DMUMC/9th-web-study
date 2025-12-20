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
function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
