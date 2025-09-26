import { useCount } from '../context/CounterProvider';
import ButtonGroup from './ButtonGroup';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeProvider';

const Counter = () => {
    const { count } = useCount();
    const { theme } = useTheme();
    const isLightMode = theme === 'LIGHT';

    return (
        <div
            className={clsx(
                'p-4 w-full h-dvh',
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
                누르면 숫자가 올라가요! {count}
            </h1>
            <ButtonGroup />
        </div>
    );
};

export default Counter;
