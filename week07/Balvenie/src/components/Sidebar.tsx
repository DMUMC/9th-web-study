import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import useDeleteAccount from '../hooks/mutations/useDeleteAccount';
import ConfirmModal from './ConfirmModal';

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const location = useLocation();
    const { accessToken } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

    const menuItems = [
        { label: '홈', to: '/' },
        { label: '찾기', to: '/search' },
        { label: '마이페이지', to: '/mypage' },
    ];

    const handleDeleteAccount = () => {
        deleteAccount();
    };

    return (
        <>
            {/* 🔥 열렸을 때만 오버레이 표시 */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30"
                    onClick={onClose}
                    aria-hidden
                />
            )}

            {/* 🔥 md:block, md:translate-x-0 제거 → 버튼을 누르기 전까지 사이드바는 항상 숨김 */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-gray-50 pt-24 transition-transform duration-200 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
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

                    {accessToken && (
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="mt-4 block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                            탈퇴하기
                        </button>
                    )}
                </nav>
            </aside>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="계정 탈퇴"
                message="정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                confirmText="예, 탈퇴합니다"
                cancelText="취소"
                isDanger
            />
        </>
    );
};

export default Sidebar;