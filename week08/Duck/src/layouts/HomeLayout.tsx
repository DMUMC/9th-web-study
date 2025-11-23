import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import FloatingActionButton from "../components/FloatingActionButton";
import LpCreateModal from "../components/LpCreateModal";
import useSidebar from "../hooks/useSidebar";

const HomeLayout = () => {
  // useSidebar 커스텀 훅 사용
  const {
    isOpen: isSidebarOpen,
    toggle: toggleSidebar,
    close: closeSidebar,
  } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="h-dvh flex flex-col">
      <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <main className="relative mt-16 flex flex-1 bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/30">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <section className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActionButton onClick={openModal} />
      <LpCreateModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default HomeLayout;
