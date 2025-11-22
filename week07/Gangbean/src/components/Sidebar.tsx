import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDeleteAccount from '../hooks/mutations/useDeleteAccount';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);
    const { accessToken } = useAuth();
    const { removeItem: removeAccessTokenFromStorage } =
        useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { removeItem: removeRefreshTokenFromStorage } =
        useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
    const navigate = useNavigate();
    const deleteAccountMutation = useDeleteAccount();

    const linkClass =
        'flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white';

    const handleDeleteAccount = () => {
        deleteAccountMutation.mutate(undefined, {
            onSuccess: () => {
                // 토큰 제거
                removeAccessTokenFromStorage();
                removeRefreshTokenFromStorage();
                // 홈으로 리다이렉트
                navigate('/');
                alert('탈퇴가 완료되었습니다.');
                // 페이지 새로고침하여 상태 초기화
                window.location.reload();
            },
            onError: (error) => {
                console.error('탈퇴 실패:', error);
                alert('탈퇴에 실패했습니다.');
            },
        });
        setIsDeleteModalOpen(false);
        onClose();
    };

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
                    {accessToken && (
                        <div className='mt-auto pt-6'>
                            <button
                                type='button'
                                onClick={() =>
                                    setIsDeleteModalOpen(
                                        true
                                    )
                                }
                                className='flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/20 hover:text-red-300'
                            >
                                <span className='text-lg'>
                                    🗑️
                                </span>
                                탈퇴하기
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* 탈퇴 확인 모달 */}
            {isDeleteModalOpen && (
                <>
                    <div
                        className='fixed inset-0 z-50 bg-black/50'
                        onClick={() =>
                            setIsDeleteModalOpen(false)
                        }
                        aria-hidden
                    />
                    <div className='fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-800 p-6 shadow-xl'>
                        <h2 className='mb-4 text-xl font-semibold text-white'>
                            정말 탈퇴하시겠습니까?
                        </h2>
                        <p className='mb-6 text-sm text-gray-300'>
                            탈퇴하시면 모든 데이터가
                            삭제되며 복구할 수 없습니다.
                            정말 탈퇴하시겠습니까?
                        </p>
                        <div className='flex justify-end gap-3'>
                            <button
                                type='button'
                                onClick={() =>
                                    setIsDeleteModalOpen(
                                        false
                                    )
                                }
                                className='rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500'
                            >
                                취소
                            </button>
                            <button
                                type='button'
                                onClick={
                                    handleDeleteAccount
                                }
                                disabled={
                                    deleteAccountMutation.isPending
                                }
                                className='rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {deleteAccountMutation.isPending
                                    ? '탈퇴 중...'
                                    : '탈퇴하기'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Sidebar;
