import clsx from 'clsx';
import { THEME, useTheme } from '../context/ThemeProvider';
import ThemeToggleButton from './ThemeToggleButton';
export default function Navbar() {
    const { theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;
    return (
        <div
            className={clsx(
                'p-4 w-full flex justify-end',
                isLightMode ? 'bg-white' : 'bg-gray-800'
            )}
        >
            <ThemeToggleButton />
        </div>
    );
}
