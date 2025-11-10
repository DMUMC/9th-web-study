import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuthStore()

  if (!isLoggedIn) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
