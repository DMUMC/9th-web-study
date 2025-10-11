import { NavLink } from "react-router-dom";

const LINKS = [
    { to: '/login', label: "로그인"},
    { to: '/login', label: "회원가입"},
]

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-black p-4 text-white">
      <NavLink to="/" className="text-xl font-bold text-[#217ef0]">
        돌려돌려LP판
      </NavLink>

      <div className="flex items-center gap-3">
        {LINKS.map(({to, label}) => {
          const buttonStyle = label === '회원가입'
            ? "bg-[#212bf0] text-white"
            : "bg-zinc-800 text-gray-300";

          return (
            <NavLink
              key={to}
              to={to}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${buttonStyle}`}
            >
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  )
}