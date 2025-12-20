import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { HomeLayout } from "./layouts/HomeLayout"
import { SignupPage } from "./pages/SignupPage"
import { MyPage } from "./pages/MyPage"
import { GoogleCallbackPage } from "./pages/GoogleCallbackPage"
import { ProtectedRoute } from "./components/ProtectedRoute"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <NotFoundPage />,
      children: [
        {index: true, element: <HomePage />},
        {path: '/login', element: <LoginPage />},
        {path: '/signup', element: <SignupPage />},
        {path: '/v1/auth/google/callback', element: <GoogleCallbackPage />},
        {
          path: '/mypage',
          element: (
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          )
        },
      ]
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
