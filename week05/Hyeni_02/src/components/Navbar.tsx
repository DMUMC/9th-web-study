// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AutoContext";

export const Navbar = () => {
  const { token, logout } = useAuth(); 
  const isAuthenticated = !!token;

  return (
    <nav className="flex items-center justify-between bg-black p-4 text-white">
      <NavLink to="/" className="text-xl font-bold text-[#217ef0]">
        돌려돌려LP판
      </NavLink>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <NavLink
              to="/mypage"
              className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors"
            >
              마이페이지
            </NavLink>
            <button
              onClick={logout}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors"
            >
              로그인
            </NavLink>
            <NavLink
              to="/signup"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              회원가입
            </NavLink>
          </>
        )}
      </div>
    </nav>
  )
}