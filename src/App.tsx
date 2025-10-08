import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      // 🔧 상세 경로를 단수 'movie/:movieId'로 변경
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
