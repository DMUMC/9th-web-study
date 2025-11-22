import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import FloatingActionButton from '../components/FloatingActionButton';
import LpCreateModal from '../components/LpCreateModal';

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!accessToken) {
        return <Navigate to={'/login'} replace />;
    }
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    return (
        <div className="h-dvh flex flex-col">
            <Navbar
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
            />

            <main className="relative mt-20 flex flex-1 bg-gray-50">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                <section className="flex-1 overflow-y-auto px-6 py-6">
                    <Outlet />
                </section>
            </main>

            <Footer />
            <FloatingActionButton onClick={openModal} />
            <LpCreateModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default ProtectedLayout;
