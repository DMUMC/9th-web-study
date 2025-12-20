// src/components/LoginConfirmModal.tsx
import { useNavigate } from 'react-router-dom';

interface LoginConfirmModalProps {
  redirectPath: string;
}

export const LoginConfirmModal = ({ redirectPath }: LoginConfirmModalProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/login', { state: { from: redirectPath } });
  };

  const handleCancel = () => {
    navigate('/lps');
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-20 z-50 bg-black/70">
      <div className="bg-neutral-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-neutral-700">
        <h2 className="text-lg font-semibold mb-3 text-white">
          로그인 필요
        </h2>
        <p className="text-gray-300 mb-6">
          로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-5 py-2 rounded-md font-semibold bg-neutral-600 hover:bg-neutral-500 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-md font-bold bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};