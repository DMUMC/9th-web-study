import { NavLink } from "react-router-dom";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function Navbar() {
  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-2">
        <NavLink to="/" className={linkCls}>홈</NavLink>
        <NavLink to="/popular" className={linkCls}>인기 영화</NavLink>
        <NavLink to="/upcoming" className={linkCls}>개봉 예정</NavLink>
        <NavLink to="/top-rated" className={linkCls}>평점 높은</NavLink>
        <NavLink to="/now-playing" className={linkCls}>상영 중</NavLink>
      </div>
    </header>
  );
}
