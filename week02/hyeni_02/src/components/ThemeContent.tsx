import clsx from 'clsx';
import { useTheme } from '../context/ThemeProvider';
import { themeClasses } from '../theme/styles';

export const ThemeContent = () => {
    const { theme } = useTheme();

    return (
        <div
            className={clsx(
                'p-4 h-dvh w-full',
                themeClasses.background[theme] 
            )}
        >
            <h1
                className={clsx(
                    'text-wxl font-bold',
                    themeClasses.text[theme] 
                )}
            >
                Theme Content
            </h1>
            <p className={clsx('mt-2', themeClasses.text[theme])}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo veritatis debitis ratione quis saepe, reiciendis, laboriosam minus aspernatur a porro veniam? Neque molestiae id expedita itaque laboriosam, iste ipsa commodi!
            </p>
        </div>
    );
};