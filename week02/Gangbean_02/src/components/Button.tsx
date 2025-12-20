import clsx from 'clsx';
import { useTheme } from '../context/ThemeProvider';

interface ButtonProps {
    text: string;
    onClick: () => void;
}

const Button = ({ onClick, text }: ButtonProps) => {
    const { theme } = useTheme();
    const isLightMode = theme === 'LIGHT';

    return (
        <button
            className={clsx(
                'text-wxl font-bold border border-solid rounded px-2 py-1 mt-2 mr-2 cursor-pointer',
                isLightMode ? 'text-black' : 'text-white'
            )}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;
