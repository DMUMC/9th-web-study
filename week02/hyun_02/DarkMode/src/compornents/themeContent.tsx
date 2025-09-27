import clsx from 'clsx';
import { THEME, useTheme } from '../context/ThemeProvider';

export default function ThemeContent(): React.ReactNode {
    const { theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return (
        <div
            className={clsx(
                'p-4 h-dvh w-full',
                isLightMode ? 'bg-white' : 'bg-gray-800'
            )}
        >
            <h1
                className={clsx(
                    'text-xl font-bold',
                    isLightMode ? 'text-black' : 'text-white'
                )}
            >
                Theme Content
            </h1>
            <p
                className={clsx(
                    'mt-2',
                    isLightMode ? 'text-black' : 'text-white'
                )}
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
                placeat amet. Unknown word. dolorum magnam magni facere vel
                sequi itaque obcaecati, at, minus dolorum. Unknown word.
                perspiciatis error sint iste quas quam laboriosam recusandae
                esse perspiciatis. Unknown word. provident.
            </p>
        </div>
    );
}
