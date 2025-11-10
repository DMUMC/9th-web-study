import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";

type HeaderProps = {
  onToggleSidebar?: () => void; // 사이드바 토글 버튼 (옵션)
};

export default function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const { isLoggedIn, setLogout } = useAuth();

  const handleLogout = () => {
    // 필요하면 alert 유지
    alert("로그아웃 되었습니다!");
    setLogout();
    navigate("/");
  };

  return (
    <div className="h-12 bg-white flex justify-between items-center">
      {/* 왼쪽: 햄버거(옵션) + 로고 */}
      <div className="flex items-center gap-2 ml-2">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
            aria-label="사이드바 토글"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>
        )}

        <Link to="/">
          <div className="text-xl text-black font-bold text-center">
            돌려돌려LP판
          </div>
        </Link>
      </div>

      {/* 오른쪽: 로그인/로그아웃/마이페이지/검색 */}
      <div className="mr-2 flex items-center gap-2 text-sm">
        {/* 찾기 아이콘 */}
        <Link to="/search" className="text-black hover:text-[#4562D6]">
          🔍️
        </Link>

        {isLoggedIn ? (
          <>
            {/* 마이페이지 */}
            <Link to="/mypage">
              <div className="bg-[#4562D6] p-1 px-3 rounded-md text-white">
                마이페이지
              </div>
            </Link>

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              className="bg-[#4562D6] p-1 px-3 rounded-md text-white"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <div className="bg-[#4562D6] p-1 px-3 rounded-md text-white">
                로그인
              </div>
            </Link>
            <Link to="/signup">
              <div className="bg-[#4562D6] p-1 px-3 rounded-md text-white">
                회원가입
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}