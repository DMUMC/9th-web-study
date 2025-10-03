import { NavLink } from "react-router-dom"

export const NavBar = () => {
  const LINKS = [
    { to: '/', label: '홈' },
    { to: '/movies/popular', label: '인기 영화' },
    { to: '/movies/now_playing', label: '상영 중' },
    { to: '/movies/top_rated', label: '평점 높은' },
    { to: '/movies/upcoming', label: '개봉 예정' },
  ];
  return (
    <div className="flex gap-5 p-4">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({isActive}) => {
            return  isActive ? 'text-[#dda5e3] font-bold' : 'text-gray-700'
          }}
        >
          {label}
        </NavLink>
      ))}
    </div>
  )
}
