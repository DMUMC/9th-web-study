import { Navigate } from "react-router-dom"
import { useLocalStorage } from "../hooks/useLocalStorage"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [accessToken] = useLocalStorage("accessToken", "")

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}