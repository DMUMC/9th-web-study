import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { HomeLayout } from "./layouts/HomeLayout";
import { SignupPage } from "./pages/SignupPage";
import { MyPage } from "./pages/MyPage";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import { storage } from "./utils/storage";
import { LOCAL_STORAGE_KEY } from "./key";
import LoginSuccessPage from "./pages/LoginSuccessPage";

// 🔒 토큰으로 보호: Outlet 패턴 (children prop 쓰지 말고, 라우터에서 children과 함께 사용)
function ProtectedGate() {
  const token = storage.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "login-success", element: <LoginSuccessPage /> },

      // ✅ 프론트가 최종 수신하는 구글 콜백 경로 (백엔드가 여기로 redirect 함)
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
      // 또는 백엔드가 /google-redirect 로 보내면 아래 줄로 사용
      // { path: "google-redirect", element: <GoogleLoginRedirectPage /> },

      // 🔒 보호 구간
      {
        element: <ProtectedGate />,
        children: [
          { path: "mypage", element: <MyPage /> },
        ],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
