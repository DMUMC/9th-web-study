import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router'
import { Layout } from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedLayout from './components/layout/ProtectedLayout'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage'

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

const publicRoutes: RouteObject[] = [
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
        path: '/v1/auth/google/callback',
        element: <GoogleLoginRedirectPage />
      }
    ]
  }
]

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        path: 'mypage',
        element: <MyPage />
      }
    ]
  }
]

const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes
])

export default App
