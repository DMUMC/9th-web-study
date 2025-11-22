import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import useLogout from '../hooks/mutations/useLogout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

type NavbarProps = {
    onToggleSidebar?: () => void;
};

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const { data: myInfo } = useGetMyInfo({
        enabled: Boolean(accessToken),
    });
    const logoutMutation = useLogout();
    const { removeItem: removeAccessTokenFromStorage } =
        useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { removeItem: removeRefreshTokenFromStorage } =
        useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const handleLogout = () => {
        if (logoutMutation.isPending) return;

        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                // 토큰 제거
                removeAccessTokenFromStorage();
                removeRefreshTokenFromStorage();
                // 홈으로 리다이렉트
                navigate('/');
                alert('로그아웃 성공');
                // 페이지 새로고침하여 상태 초기화
                window.location.reload();
            },
            onError: (error) => {
                console.error('로그아웃 실패:', error);
                alert('로그아웃 실패');
            },
        });
    };

    return (
        <nav className='bg-white dark:bg-gray-900 shadow-md fixed w-full z-10'>
            <div className='flex items-center justify-between p-4'>
                <div className='flex items-center gap-3'>
                    {onToggleSidebar && (
                        <button
                            type='button'
                            onClick={onToggleSidebar}
                            className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition-transform hover:scale-95 focus:outline-none'
                            aria-label='사이드바 토글'
                        >
                            <svg
                                width='24'
                                height='24'
                                viewBox='0 0 48 48'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='4'
                                    d='M7.95 11.95h32m-32 12h32m-32 12h32'
                                />
                            </svg>
                        </button>
                    )}
                    <Link
                        to='/'
                        className='text-xl font-bold text-gray-900 dark:text-white'
                    >
                        SpinningSpinning
                    </Link>
                </div>
                <div className='flex items-center gap-6'>
                    <Link
                        to='/search'
                        className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                    >
                        🔍️
                    </Link>
                    {accessToken ? (
                        <>
                            {myInfo && (
                                <span className='text-gray-700 dark:text-gray-300'>
                                    {myInfo.name}님
                                    환영합니다!
                                </span>
                            )}
                            <Link
                                to='/my'
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                            >
                                마이페이지
                            </Link>
                            <button
                                className='cursor-pointer bg-blue-300 rounded-sm px-3 py-1 hover:scale-90 disabled:opacity-50 disabled:cursor-not-allowed'
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                            >
                                {logoutMutation.isPending
                                    ? '로그아웃 중...'
                                    : '로그아웃'}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to='/login'
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                            >
                                로그인
                            </Link>
                            <Link
                                to='/signup'
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                            >
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
