import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import FloatingButton from './FloatingButton/FloatingButton';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#111]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <FloatingButton />
    </div>
  );
};

export default Layout;

