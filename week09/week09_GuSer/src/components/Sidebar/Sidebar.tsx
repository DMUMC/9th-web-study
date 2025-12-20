import { Link, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar';
import { isAuthenticated, removeTokens } from '../../utils/token';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { deleteUser } from '../../apis/auth';
import { useModalStore } from '../../store/zustand/modalStore';
import ConfirmModal from '../Modal/ConfirmModal';

const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authenticated = isAuthenticated();
  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModalStore();

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      removeTokens();
      queryClient.clear();
      navigate('/login');
    },
  });

  const handleDeleteUser = () => {
    deleteUserMutation.mutate();
  };

  const menuItems = authenticated
    ? [
        { path: '/lps', label: '찾기' },
        { path: '/mypage', label: '마이페이지' },
      ]
    : [
        { path: '/lps', label: '찾기' },
      ];

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-gray-800
          transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={close}
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {authenticated && (
            <>
              <button
                onClick={() => {
                  removeTokens();
                  queryClient.clear();
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
              >
                로그아웃
              </button>
              <button
                onClick={openDeleteModal}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-md transition-colors"
              >
                탈퇴하기
              </button>
            </>
          )}
        </nav>
      </aside>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="탈퇴 확인"
        message="정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다."
        onConfirm={handleDeleteUser}
        onCancel={closeDeleteModal}
        confirmText="탈퇴하기"
        cancelText="취소"
      />
    </>
  );
};

export default Sidebar;

