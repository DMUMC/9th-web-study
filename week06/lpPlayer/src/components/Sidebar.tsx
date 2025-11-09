import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: 'overlay' | 'static' | 'dropdown';
};

const navItems: Array<{ label: string; to: string; icon: 'search' | 'user' | 'plus' }> = [
  { label: '찾기', to: '/', icon: 'search' },
  { label: '마이페이지', to: '/mypage', icon: 'user' },
  { label: '새 LP 작성', to: '/lp/new', icon: 'plus' },
];

const Icon = ({ name }: { name: 'search' | 'user' | 'plus' }) => {
  switch (name) {
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor">
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.86 0-7 2.09-7 4.67V20h14v-1.33C19 16.09 15.86 14 12 14Z" />
        </svg>
      );
    case 'plus':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor">
          <path d="M12 5v14M5 12h14" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor">
          <path
            d="M15.5 14h-.79l-.28-.27A6 6 0 1 0 14 15.5l.27.28v.79L20 21l1-1-5.5-6Z"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

export const Sidebar = ({
  isOpen = false,
  onClose = () => {},
  variant = 'overlay',
}: SidebarProps) => {
  const location = useLocation();
  const activePath = useMemo(() => location.pathname, [location.pathname]);
  const isStatic = variant === 'static';
  const isDropdown = variant === 'dropdown';

  const baseClass = 'bg-[#08080d] px-6 py-8 transition-transform duration-300 h-full';
  const positionClass = (() => {
    if (isStatic) return 'relative z-10 w-60 border-r border-neutral-900';
    if (isDropdown) {
      return `absolute left-4 sm:left-8 top-full mt-4 z-40 w-64 sm:w-72 md:w-80 rounded-[24px] border border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.65)] ${
        isOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-3'
      }`;
    }
    return `fixed inset-y-0 left-0 z-40 w-64 sm:w-72 md:w-80 transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } shadow-2xl`;
  })();

  return (
    <>
      <aside className={`${positionClass} ${baseClass}`} aria-label="사이드바">
        <div className="flex h-full flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-600">menu</p>
            <nav className="mt-6 flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = item.to === '/' ? activePath === '/' : activePath.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      if (!isStatic) onClose();
                    }}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-white/5 text-white' : 'text-neutral-500 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            type="button"
            className="text-left text-xs font-medium tracking-wide text-neutral-600 transition-colors hover:text-white"
          >
            탈퇴하기
          </button>
        </div>
      </aside>
      {!isStatic && !isDropdown && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onClose}
          role="presentation"
        />
      )}
    </>
  );
};
