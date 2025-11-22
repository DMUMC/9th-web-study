import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

    // ESC 키로 Sidebar 닫기 기능
    useEffect(() => {
        if (!isOpen || !onClose) return;

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscapeKey);

        // 클린업 함수: EventListener 등록 해제하여 메모리 누수 방지
        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    // 배경 스크롤 방지: Sidebar가 열렸을 때 body 스크롤 막기
    useEffect(() => {
        if (isOpen) {
            // overflow: hidden만 사용하여 스크롤 방지
            // position: fixed를 사용하지 않아 헤더에 영향 없음
            // 스크롤 위치는 자동으로 유지됨
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } else {
            // 스크롤 방지 해제
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }

        // 클린업 함수: 컴포넌트 언마운트 시 스크롤 방지 해제
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const menuItems = [
        { label: '홈', to: '/' },
        { label: '찾기', to: '/search' },
        { label: '마이페이지', to: '/my' },
    ];

    const handleDeleteAccount = () => {
        deleteAccount();
    };

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
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-gray-50 pt-24 transition-all duration-300 ease-in-out ${
                    isOpen
                        ? 'translate-x-0 opacity-100'
                        : '-translate-x-full opacity-0'
                } md:static md:block md:translate-x-0 md:opacity-100 md:bg-transparent md:pt-24`}
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
