import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import useSidebar from '../hooks/useSidebar';

const HomeLayout = () => {
    const { isOpen, toggle, close } = useSidebar();

    return (
        <>
            <Sidebar isOpen={isOpen} onClose={close} />
            <div className='h-dvh flex flex-col'>
                <Navbar onToggleSidebar={toggle} />
                <main className='flex-1 mt-20 px-4 pb-8 lg:px-8'>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
};

export default HomeLayout;
