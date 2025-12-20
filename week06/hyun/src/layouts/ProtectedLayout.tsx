import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import FloatingActionButton from '../components/FloatingActionButton';

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!accessToken) {
        return <Navigate to={'/login'} replace />;
    }
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

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
            <FloatingActionButton to="/lp/new" />
        </div>
    );
};

export default ProtectedLayout;
