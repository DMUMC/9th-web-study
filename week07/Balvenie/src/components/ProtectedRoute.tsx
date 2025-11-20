import { Navigate } from "react-router-dom"
import { useAuth } from "../useAuth"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { authStore } from "../authStore"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const {  } = useLocalStorage("accessToken", "")

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!authStore) {
    alert("로그인이 필요합니다.")
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}