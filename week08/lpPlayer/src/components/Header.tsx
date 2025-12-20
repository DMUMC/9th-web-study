import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { useMyInfoQuery } from '../hooks/queries/useMyInfoQuery';
import { SearchIcon } from './icons/SearchIcon';
import HamburgerButton from '../assets/hamburger-button.svg';
import { postSignout } from '../apis/auth';

type HeaderProps = {
  onMenuClick?: () => void;
};

const baseButton =
  'rounded-lg px-5 py-2 text-sm font-semibold transition-colors';
const outlineButton =
  'bg-black border border-neutral-700 text-white hover:border-neutral-500';
const primaryButton = 'bg-[#ff2b9c] text-white hover:bg-[#ff4cad] shadow-md';

export default function Header({ onMenuClick }: HeaderProps) {
  const { isLoggedIn, setLogout } = useAuth();
  const { data: myInfo } = useMyInfoQuery();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: postSignout,
    onSuccess: () => {
      setLogout();
      queryClient.removeQueries({ queryKey: ['me'] });
      navigate('/');
    },
    onError: () => {
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleLogout = () => {
    if (isLoggingOut) return;
    logout();
  };

  return (
    <div className="flex h-20 items-center justify-between bg-[#050505] px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-neutral-800 p-2 text-white transition-colors hover:border-neutral-600"
          aria-label="사이드바 열기"
        >
          <img
            src={HamburgerButton}
            alt="사이드바 열기"
            className="h-6 w-6 brightness-0 invert"
          />
        </button>
        <Link to="/">
          <div className="text-2xl font-black tracking-wide text-[#ff2b9c]">DOLIGO</div>
        </Link>
      </div>

      <div className="flex items-center gap-4 text-sm text-white">
        <button
          type="button"
          className="hidden items-center gap-2 rounded-full border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white lg:flex"
        >
          <SearchIcon className="h-4 w-4" />
          찾기
        </button>
        {isLoggedIn ? (
          <>
            <span className="hidden text-base font-semibold text-white sm:inline">
              {myInfo?.name ? `${myInfo.name}님 반갑습니다.` : '반갑습니다.'}
            </span>
            <Link to="/mypage" className={`${baseButton} ${outlineButton}`}>
              마이페이지
            </Link>
            <button onClick={handleLogout} className={`${baseButton} ${primaryButton}`} disabled={isLoggingOut}>
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`${baseButton} ${outlineButton}`}>
              로그인
            </Link>
            <Link to="/signup" className={`${baseButton} ${primaryButton}`}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
