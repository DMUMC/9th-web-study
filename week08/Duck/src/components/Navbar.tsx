import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useLogout from "../hooks/mutations/useLogout";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

type NavbarProps = {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
};

const Navbar = ({ onToggleSidebar, isSidebarOpen = false }: NavbarProps) => {
  const { accessToken } = useAuth();
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();
  const { data } = useGetMyInfo();

  // 2. data.data?.name 등 MyPage에서만 필요한 상태 관련 부분을 제거합니다.
  // Navbar에서는 간단히 '로그아웃' 버튼만 표시합니다.

  return (
    <nav className="fixed z-[100] w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              className="md:hidden rounded-lg p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
              onClick={onToggleSidebar}
              aria-pressed={isSidebarOpen}
              aria-label="사이드바 토글"
            >
              <svg
                width="24"
                height="24"
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
          <Link
            to="/"
            className="text-xl font-bold text-white hover:text-purple-100 transition-colors duration-200"
          >
            🎵 Spinning Spinning Dolimpan
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* 로그인/회원가입 */}
          {!accessToken && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200 font-medium"
              >
                로그인
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                회원가입
              </Link>
            </>
          )}

          {/* 로그인 시: 검색, 마이페이지, 로그아웃 */}
          {accessToken && (
            <>
              <Link
                to="/search"
                className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200 font-medium"
              >
                🔍 검색
              </Link>
              <Link
                to="/my"
                className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200 font-medium"
              >
                👤 {data?.data?.name}님
              </Link>
              <button
                type="button"
                onClick={() => handleLogout()}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
