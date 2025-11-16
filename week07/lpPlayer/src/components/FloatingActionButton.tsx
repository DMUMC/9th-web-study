import { useNavigate, useLocation } from 'react-router-dom';

type FloatingActionButtonProps = {
  onClick?: () => void;
};

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    navigate('/lp/new', { state: { from: location } });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-8 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff2b9c] text-3xl font-bold text-white shadow-[0_15px_40px_rgba(255,43,156,0.45)] transition-transform hover:scale-105"
      aria-label="LP 작성하기"
    >
      +
    </button>
  );
};
