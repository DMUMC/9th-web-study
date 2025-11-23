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
    <nav className="fixed top-0 z-[100] w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* 로고 영역 */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              type="button"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-all hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 hover:text-pink-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              onClick={onToggleSidebar}
              aria-pressed={isSidebarOpen}
              aria-label="사이드바 토글"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.5"
                  d="M7.95 11.95h32m-32 12h32m-32 12h32"
                />
              </svg>
            </button>
          )}
          <Link
            to="/"
            className="group flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-md shadow-pink-500/30 transition-transform group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-pink-500/40">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <span className="hidden text-lg font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent sm:block bg-[length:200%_auto] animate-[gradient_3s_ease_infinite]">
              Spinning Dolimpan
            </span>
          </Link>
        </div>

        {/* 메뉴 영역 */}
        <div className="flex items-center gap-2">
          {/* 로그인 전 */}
          {!accessToken && (
            <>
              <Link
                to="/login"
                className="hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 hover:text-pink-600 active:scale-95 sm:block"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-500/30 transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-105 active:scale-100"
              >
                회원가입
              </Link>
            </>
          )}

          {/* 로그인 후 */}
          {accessToken && (
            <>
              <Link
                to="/search"
                className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-pink-600 active:scale-95"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="hidden lg:inline">검색</span>
              </Link>

              <Link
                to="/my"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-pink-600 active:scale-95"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-xs font-bold text-white shadow-sm">
                  {data?.data?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden lg:inline font-semibold">
                  {data?.data?.name || "사용자"}님
                </span>
              </Link>

              <button
                type="button"
                onClick={() => handleLogout()}
                disabled={isLoggingOut}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
              >
                {isLoggingOut ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="hidden sm:inline">로그아웃 중...</span>
                  </span>
                ) : (
                  <span className="hidden sm:inline">로그아웃</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
