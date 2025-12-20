import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import useSidebar from '../hooks/useSidebar';

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const { isOpen, toggle, close } = useSidebar();

    if (!accessToken) {
        return <Navigate to='/login' replace />;
    }
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

export default ProtectedLayout;
