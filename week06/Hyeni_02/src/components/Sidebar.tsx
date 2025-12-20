// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AutoContext';

interface SidebarProps {
}

export const Sidebar = ({}: SidebarProps) => {
  const { token, logout } = useAuth();
  const isAuthenticated = !!token;

  return (
    <>
      <aside
        className={`static w-56 h-auto flex-shrink-0
          bg-neutral-900 border-r border-neutral-800 z-10
        `}
      >
        <nav className="p-4 space-y-2">
          <NavLink
            to="/lps"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-medium
              ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-neutral-800 hover:text-white'}`
            }
          >
            찾기 (LP 목록)
          </NavLink>
          
          <NavLink
            to="/mypage"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-medium
              ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-neutral-800 hover:text-white'}`
            }
          >
            마이페이지
          </NavLink>
        </nav>
        
        <div className="p-4 mt-auto border-t border-neutral-800 space-y-2">
           {isAuthenticated ? (
             <button
              onClick={() => {
                logout();
              }}
              className="w-full text-center px-4 py-2 rounded-md font-medium text-red-400 bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className="block text-center px-4 py-2 rounded-md font-medium bg-neutral-800 text-gray-300 hover:bg-neutral-700"
              >
                로그인
              </NavLink>
              <NavLink
                to="/signup"
                className="block text-center px-4 py-2 rounded-md font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                회원가입
              </NavLink>
            </>
          )}
        </div>
        
      </aside>
    </>
  );
};