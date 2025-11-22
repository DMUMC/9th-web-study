import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const HomeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />
            <div className='h-dvh flex flex-col'>
                <Navbar onToggleSidebar={toggleSidebar} />
                <main className='flex-1 mt-20 px-4 pb-8 lg:px-8'>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
};

export default HomeLayout;
