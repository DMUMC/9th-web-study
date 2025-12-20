import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/NotFound';
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <HomePage />,
            errorElement: <NotFound />,
            children: [
                {
                    path: 'movies/:category',
                    element: <MoviePage />,
                },
                {
                    path: 'movie/:movieId',
                    element: <MovieDetailPage />,
                },
            ],
        },
    ]);
    return <RouterProvider router={router} />;
}

export default App;
