import { Link } from "react-router-dom";
import { useAuth } from "../useAuth";

export default function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <div className='h-12 bg-white flex justify-between items-center'>
      <Link to="/">
        <div className='text-xl text-black font-bold text-center ml-2'>돌려돌려LP판</div>
      </Link>
      
      <div className='mr-2 flex gap-2 text-sm text-white'>
        {isLoggedIn ? (
          <Link to="/mypage">
            <div className='bg-[#4562D6] p-1 px-3 rounded-md'>마이페이지</div>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <div className='bg-[#4562D6] p-1 px-3 rounded-md'>로그인</div>
            </Link>
            <Link to="/signup">
              <div className='bg-[#4562D6] p-1 px-3 rounded-md'>회원가입</div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}