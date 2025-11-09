import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { FloatingActionButton } from '../components/FloatingActionButton';

export const HomeLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#020205] text-white">
      <header className="border-b border-neutral-900/60">
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      </header>
      <div className="flex min-h-[calc(100vh-5rem)]">
        <div
          className={`${
            isSidebarOpen ? 'w-64 sm:w-72 md:w-80 border-r border-neutral-900' : 'w-0 border-r-0'
          } overflow-hidden bg-[#08080d] transition-all duration-300`}
        >
          {isSidebarOpen && (
            <Sidebar variant="static" isOpen onClose={() => setSidebarOpen(false)} />
          )}
        </div>
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_55%)] px-4 py-8 sm:px-10">
          <Outlet />
        </main>
      </div>
      <FloatingActionButton />
    </div>
  );
};
