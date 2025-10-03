import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'

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
    children: [
      {
        index: true,
        element: <MainPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      }
    ]
  }
])

export default App
