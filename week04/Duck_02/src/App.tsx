import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./Layout/HomeLayout";
import SignupPage from "./pages/SignupPage";
import Mypage from "./pages/Mypage";
// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/signup",
          element: <SignupPage />,
        },
        {
          path: "/mypage",
          element: <Mypage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
