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
    <nav className="fixed top-0 z-[100] w-full glass border-b border-pink-100/50 shadow-soft">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              type="button"
              className="md:hidden rounded-xl p-2.5 text-gray-600 transition-all hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              onClick={onToggleSidebar}
              aria-pressed={isSidebarOpen}
              aria-label="사이드바 토글"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
          <Link
            to="/"
            className="text-2xl font-extrabold gradient-text transition-transform hover:scale-105"
          >
            🎵 Spinning Dolimpan
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* 로그인/회원가입 */}
          {!accessToken && (
            <>
              <Link
                to="/login"
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600"
              >
                로그인
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-xl hover:scale-105"
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
                className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                검색
              </Link>
              <Link
                to="/my"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="hidden sm:inline">
                  {data?.data?.name || "마이페이지"}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => handleLogout()}
                disabled={isLoggingOut}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
