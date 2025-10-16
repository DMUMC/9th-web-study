import {
    createBrowserRouter,
    RouterProvider,
    type RouteObject,
} from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';

const publicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <HomeLayout />,
        errorElement: <NotFound />,
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
        ],
    },
];

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
