// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AutoContext"; // AutoContext 사용

import burgerIconUrl from '../assets/burger.png'; 

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { token, userName, logout } = useAuth(); 
  const isAuthenticated = !!token;

  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between bg-black p-4 text-white shadow-md h-16 border-b border-neutral-800">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-neutral-800 md:hidden"
          aria-label="메뉴 열기"
        >
          <img src={burgerIconUrl} alt="메뉴 열기" className="w-6 h-6" />
        </button>
        
        <NavLink to="/lps" className="text-xl font-bold text-blue-600">
          돌려돌려LP판
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-neutral-800" title="검색하기">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        
        {isAuthenticated ? (
          <>
            <span className="hidden md:flex items-center gap-2 text-gray-300 font-medium">
              <img src={`https://placehold.co/32x32/777777/FFFFFF?text=${userName?.[0] || 'U'}`} alt="profile" className="w-8 h-8 rounded-full" />
              {userName || '사용자'}님 반갑습니다.
            </span>
            <button
              onClick={logout}
              className="hidden md:block rounded-md bg-neutral-800 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-neutral-700 transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="hidden md:block rounded-md bg-neutral-800 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors"
            >
              로그인
            </NavLink>
            <NavLink
              to="/signup"
              className="hidden md:block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              회원가입
            </NavLink>
          </>
        )}
      </div>
    </nav>
  )
}