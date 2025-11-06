import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setLogin } = useAuthStore();

  useEffect(() => {
    const handleGoogleCallback = () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      if (error) {
        navigate("/login");
        return;
      }

      if (accessToken && refreshToken) {
        setLogin(accessToken, refreshToken);
        navigate("/");
      } else {
        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [searchParams, setLogin, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black">
      <div className="text-white text-lg">구글 로그인 처리 중...</div>
    </div>
  );
};
