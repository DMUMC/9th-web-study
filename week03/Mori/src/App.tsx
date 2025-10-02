import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageProvider } from "./contexts/PageProvider";
import MoviePage from "./pages/MoviePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";

const router= createBrowserRouter([
  {
    path:'/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      {
        path: 'details/:movieId',
        element: <MovieDetailPage />,
      }
    ]
  }
])

function App() {
  return (
    <PageProvider>
      <RouterProvider router={router} />
    </PageProvider>
  )
}

export default App;
