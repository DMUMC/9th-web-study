import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <HomeLayout />,
            errorElement: <NotFound />,
            children: [
                { index: true, element: <Homepage /> },
                { path: 'login', element: <LoginPage /> },
                { path: 'signup', element: <SignupPage /> },
                { path: 'my', element: <MyPage /> },
            ],
        },
    ]);
    return <RouterProvider router={router} />;
}

export default App;
