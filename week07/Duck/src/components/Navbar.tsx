import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useLogout from '../hooks/mutations/useLogout';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';

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
        <nav className="fixed z-[100] w-full bg-white shadow-md dark:bg-gray-900">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    {onToggleSidebar && (
                        <button
                            type="button"
                            className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="text-xl font-bold text-gray-900 dark:text-white"
                    >
                        Spinning Spinning Dolimpan
                    </Link>
                </div>

                <div className="space-x-6">
                    {/* 로그인/회원가입 */}
                    {!accessToken && (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                            >
                                로그인
                            </Link>

                            <Link
                                to="/signup"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                            >
                                회원가입
                            </Link>
                        </>
                    )}

                    {/* 로그인 시: 검색, 마이페이지, 로그아웃 */}
                    {accessToken && (
                        <Link
                            to="/search"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                        >
                            검색
                        </Link>
                    )}
                    {accessToken && (
                        <Link
                            to="/my"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                        >
                            {data?.data?.name}님 반갑습니다
                        </Link>
                    )}
                    {accessToken && (
                        <button
                            type="button"
                            onClick={() => handleLogout()}
                            disabled={isLoggingOut}
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 disabled:opacity-50"
                        >
                            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
