import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MoviePage from './pages/MoviePage'
import MainPage from './pages/MainPage'
import ErrorPage from './pages/ErrorPage'
import { Layout } from './components/layout/Layout'

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	)
}

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <MainPage />,
			},
			{
				path: 'movie/:category/:page',
				element: <MoviePage />,
			},
		],
	},
])

export default App
