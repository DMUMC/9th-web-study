import { useNavigate } from 'react-router-dom';

type FloatingActionButtonProps = {
    to: string;
    label?: string;
};

const FloatingActionButton = ({
    to,
    label = '+',
}: FloatingActionButtonProps) => {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(to)}
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-2xl font-bold text-white shadow-xl transition hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300"
            aria-label="새 LP 작성"
        >
            {label}
        </button>
    );
};

export default FloatingActionButton;

