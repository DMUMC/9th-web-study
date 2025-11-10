import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { HomeLayout } from "./layouts/HomeLayout"
import { SignupPage } from "./pages/SignupPage"
import { MyPage } from "./pages/MyPage"
import { GoogleCallbackPage } from "./pages/GoogleCallbackPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LpDetailPage } from "./pages/LpDetailPage"

const queryClient = new QueryClient()

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
        {
          path: '/lp/:lpid',
          element: (
            <ProtectedRoute>
              <LpDetailPage />
            </ProtectedRoute>
          )
        },
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
