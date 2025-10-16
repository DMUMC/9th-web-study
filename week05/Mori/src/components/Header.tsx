import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { isLoggedIn, setLogout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    alert("로그아웃 되었습니다!")
    setLogout()
    navigate('/')
  }

  return (
    <div className='h-12 bg-[#202020] flex justify-between items-center'>
      <Link to="/">
        <div className='text-xl text-[#ff00b3] font-bold text-center ml-2'>돌려돌려LP판</div>
      </Link>
      
      <div className='mr-2 flex gap-2 text-sm text-white'>
        {isLoggedIn ? (
          <>
            <Link to="/mypage">
              <div className='bg-[#ff00b3] p-1 px-3 rounded-md'>마이페이지</div>
            </Link>
            <button 
              onClick={handleLogout}
              className='bg-black p-1 px-3 rounded-md'
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <div className='bg-black p-1 px-3 rounded-md'>로그인</div>
            </Link>
            <Link to="/signup">
              <div className='bg-[#ff00b3] p-1 px-3 rounded-md'>회원가입</div>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
