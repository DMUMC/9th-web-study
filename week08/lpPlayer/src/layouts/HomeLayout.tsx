import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { LpCreateModal } from '../components/LpCreateModal';
import { useAuth } from '../useAuth';
import { useSidebar } from '../hooks/useSidebar';

export const HomeLayout = () => {
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar, toggle: toggleSidebar } = useSidebar();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  const handleFabClick = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white">
      <header className="border-b border-neutral-900/60">
        <Header onMenuClick={toggleSidebar} />
      </header>
      <div className="flex min-h-[calc(100vh-5rem)]">
        <div
          className={`${
            isSidebarOpen ? 'w-64 sm:w-72 md:w-80 border-r border-neutral-900' : 'w-0 border-r-0'
          } overflow-hidden bg-[#08080d] transition-all duration-300`}
        >
          {isSidebarOpen && <Sidebar variant="static" isOpen onClose={closeSidebar} />}
        </div>
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_55%)] px-4 py-8 sm:px-10">
          <Outlet />
        </main>
      </div>
      <FloatingActionButton onClick={handleFabClick} />
      <LpCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode="create"
        onCompleted={() => setCreateModalOpen(false)}
      />
    </div>
  );
};
