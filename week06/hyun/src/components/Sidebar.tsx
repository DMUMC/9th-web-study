import { Link, useLocation } from 'react-router-dom';

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const location = useLocation();

    const menuItems = [
        { label: '홈', to: '/' },
        { label: '찾기', to: '/search' },
        { label: '마이페이지', to: '/my' },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                    aria-hidden
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-gray-50 pt-24 transition-transform duration-200 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:static md:block md:translate-x-0 md:bg-transparent md:pt-24`}
            >
                <nav className="space-y-2 px-6 py-4 text-gray-700">
                    {menuItems.map(({ label, to }) => {
                        const isActive =
                            to === '/'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(to);

                        return (
                            <Link
                                key={label}
                                to={to}
                                className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={onClose}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
