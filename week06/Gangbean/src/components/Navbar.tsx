import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { accessToken } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className='bg-white dark:bg-gray-900 shadow-md fixed w-full z-10'>
            <div className='flex items-center justify-between p-4'>
                <Link
                    to='/'
                    className='text-xl font-bold text-gray-900 dark:text-white'
                >
                    SpinningSpinning
                </Link>
                <div className='space-x-6'>
                    <Link
                        to='/search'
                        className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                    >
                        🔍️
                    </Link>
                    {!accessToken && (
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
                    {accessToken && (
                        <>
                            <Link
                                to='/my'
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                            >
                                마이페이지
                            </Link>
                            <button
                                className='cursor-pointer bg-blue-300 rounded-sm px-3 py-1 hover:scale-90'
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
