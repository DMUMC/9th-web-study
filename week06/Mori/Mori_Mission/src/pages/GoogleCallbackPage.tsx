import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export const GoogleCallbackPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setLogin } = useAuthStore()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const accessToken = searchParams.get('accessToken')
        const refreshToken = searchParams.get('refreshToken')
        const error = searchParams.get('error')

        if (error) {
          alert('구글 로그인 중 오류가 발생했습니다.')
          navigate('/login')
          return
        }

        if (accessToken && refreshToken) {
          setLogin(accessToken, refreshToken, null)
          alert('구글 로그인 성공!')
          navigate('/')
        } else {
          alert('구글 로그인에 실패했습니다.')
          navigate('/login')
        }
      } catch {
        alert('로그인 처리 중 오류가 발생했습니다.')
        navigate('/login')
      }
    }

    handleGoogleCallback()
  }, [searchParams, setLogin, navigate])

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black">
      <div className="text-white text-lg">구글 로그인 처리 중...</div>
    </div>
  )
}
