import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/token';
import { useModalStore } from '../../store/zustand/modalStore';
import AuthRequiredModal from '../Modal/AuthRequiredModal';

const FloatingButton = () => {
  const navigate = useNavigate();
  const { isOpen, open, close } = useModalStore();

  const handleClick = () => {
    if (isAuthenticated()) {
      navigate('/create-lp');
    } else {
      open();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-600 hover:bg-pink-700 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-colors z-40"
      >
        +
      </button>
      <AuthRequiredModal isOpen={isOpen} onClose={close} />
    </>
  );
};

export default FloatingButton;

