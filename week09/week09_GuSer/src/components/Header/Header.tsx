import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../apis/auth';
import { isAuthenticated, removeTokens } from '../../utils/token';
import { useSidebar } from '../../hooks/useSidebar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLogout } from '../../apis/auth';

const Header = () => {
  const navigate = useNavigate();
  const { toggle } = useSidebar();
  const queryClient = useQueryClient();
  const authenticated = isAuthenticated();

  const { data: user } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: getMe,
    enabled: authenticated,
  });

  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      removeTokens();
      queryClient.clear();
      navigate('/login');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className="md:hidden text-white p-2 hover:bg-gray-800 rounded"
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
            <Link to="/" className="text-2xl font-bold text-pink-600">
              DOLIGO
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {authenticated ? (
              <>
                <span className="text-gray-300 hidden sm:block">
                  {user?.nickname || '사용자'}님 반갑습니다.
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-md transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

