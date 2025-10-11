import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: '홈' },
  { to: '/movies/popular', label: '인기 영화' },
  { to: '/movies/now_playing', label: '상영 중' },
  { to: '/movies/top_rated', label: '평점 높은 영화' },
  { to: '/movies/upcoming', label: '개봉 예정' },
];

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur">
      <nav className="mx-auto max-w-7xl px-5 py-3 flex items-center gap-6">
        {/* 로고 */}
        <div className="text-[#e50914] font-extrabold tracking-widest text-lg">
          MOVIES
        </div>

        {/* 링크 */}
        <div className="flex items-center gap-5">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'text-white font-semibold border-b-2 border-[#e50914] pb-0.5'
                  : 'text-gray-300 hover:text-white transition-colors'
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* 오른쪽 유틸(간단 아이콘 느낌) */}
        <div className="ml-auto flex items-center gap-4 text-gray-300">
          <span className="hidden md:inline text-sm bg-white/5 px-2 py-1 rounded-md border border-white/10">
            검색
          </span>
          <div className="size-7 rounded-full bg-white/10 border border-white/10" />
        </div>
      </nav>
    </header>
  );
};
