import './App.css';
import HomePage from './pages/HomePage';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import MovieDetailPage from './pages/MovieDetail';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/:id',
        element: <MovieDetailPage />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;