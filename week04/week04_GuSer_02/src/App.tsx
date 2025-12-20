import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'

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
      },
      {
        path: '/signup',
        element: <SignupPage />
      },
      {
        path: '/mypage',
        element: <MyPage />
      }
    ]
  }
])

export default App