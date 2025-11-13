import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuthStore()
  const location = useLocation()

  if (!isLoggedIn) {
    alert("로그인이 필요한 작업입니다. 로그인 해 주세요.")
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
