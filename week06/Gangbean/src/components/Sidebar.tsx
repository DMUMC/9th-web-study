import { Link } from 'react-router-dom';

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const linkClass =
        'flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white';

    return (
        <>
            {isOpen && (
                <div
                    className='fixed inset-0 z-30 cursor-pointer'
                    onClick={onClose}
                    aria-hidden
                />
            )}
            <aside
                className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col bg-gray-900 text-white shadow-2xl transition-transform duration-300 ${
                    isOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                }`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className='flex flex-1 flex-col px-6 py-6'>
                    <nav className='flex flex-col gap-3 text-base text-gray-200'>
                        <Link
                            to='/search'
                            className={linkClass}
                            onClick={onClose}
                        >
                            <span className='text-lg'>
                                🔍️
                            </span>
                            찾기
                        </Link>
                        <Link
                            to='/my'
                            className={linkClass}
                            onClick={onClose}
                        >
                            <span className='text-lg'>
                                👤
                            </span>
                            마이페이지
                        </Link>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
