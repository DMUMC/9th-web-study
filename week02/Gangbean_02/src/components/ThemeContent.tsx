import clsx from 'clsx';
import { useTheme } from '../context/ThemeProvider';

const ThemeContent = () => {
    const { theme } = useTheme();
    const isLightMode = theme === 'LIGHT';
    return (
        <div
            className={clsx(
                'p-4 w-full',
                isLightMode ? 'bg-white' : 'bg-gray-800'
            )}
        >
            <h1
                className={clsx(
                    'text-wxl font-bold',
                    isLightMode
                        ? 'text-black'
                        : 'text-white'
                )}
            >
                Theme Content
            </h1>
            <p
                className={clsx(
                    'mt-2',
                    isLightMode
                        ? 'text-black'
                        : 'text-white'
                )}
            >
                Tailwind CSS works by scanning all of your
                HTML files, JavaScript components, and any
                other templates for class names, generating
                the corresponding styles and then writing
                them to a static CSS file.
            </p>
        </div>
    );
};

export default ThemeContent;
