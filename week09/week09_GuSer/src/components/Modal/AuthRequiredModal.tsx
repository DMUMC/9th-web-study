import { useNavigate } from 'react-router-dom';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthRequiredModal = ({ isOpen, onClose }: AuthRequiredModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    navigate('/login');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">로그인이 필요합니다</h3>
        <p className="text-gray-300 mb-6">
          로그인이 필요한 서비스입니다. 로그인 해주세요!
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-md transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;

