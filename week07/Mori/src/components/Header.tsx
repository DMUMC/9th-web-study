import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSidebarToggle?: () => void
}

export const Header = ({ onSidebarToggle }: HeaderProps) => {
  const { isLoggedIn, setLogout, userName } = useAuthStore()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // 로그아웃은 클라이언트에서만 처리 (토큰 삭제)
      setLogout()
    },
    onSuccess: () => {
      alert("로그아웃 되었습니다!")
      navigate('/')
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error)
      // 에러가 발생해도 로그아웃 처리
      setLogout()
      navigate('/')
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <div className='h-12 bg-[#202020] flex justify-between items-center px-2'>
      <div className='flex items-center gap-2'>
        {onSidebarToggle && (
          <button
            type="button"
            className='text-white'
            onClick={onSidebarToggle}
            aria-label="사이드바 열기"
          >
            <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
            </svg>
          </button>
        )}
        <Link to="/">
          <div className='text-xl text-[#ff00b3] font-bold text-center ml-2'>돌려돌려LP판</div>
        </Link>
      </div>
      
      <div className='mr-2 flex items-center gap-3 text-sm text-white'>
        {isLoggedIn ? (
          <>
            <span className='text-base font-medium'>
              {(userName ?? '회원') + '님, 반갑습니다.'}
            </span>
            <button 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className='bg-black p-1 px-3 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <div className='bg-black p-1 px-3 rounded-md cursor-pointer'>로그인</div>
            </Link>
            <Link to="/signup">
              <div className='bg-[#ff00b3] p-1 px-3 rounded-md cursor-pointer'>회원가입</div>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
