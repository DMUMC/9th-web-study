import clsx from 'clsx';
import { useTheme } from '../context/ThemeProvider';

export const ThemeContent = () => {
    const {theme} = useTheme();

    const isLightMode = theme === 'LIGHT';
    
    return (
        <div
            className={clsx(
                'p-4 h-dvh w-full',
                isLightMode ? 'bg-white' : 'bg-gray-800'
            )}
        >
            <h1
                className={clsx(
                    'text-wxl font-bold',
                    isLightMode? 'text-black' : 'text-white'
                )}
            >
                Theme Content
            </h1>
            <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam fugit recusandae, itaque natus nisi alias cumque cum fuga iste quia suscipit architecto nihil est earum eum? Facilis doloremque corrupti aliquid.
            </p>
        </div>
    );
};