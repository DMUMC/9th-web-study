import { useCount } from '../context/CounterProvider';
import ButtonGroup from './ButtonGroup';
import CounterDisplay from './CounterDisplay';
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
            <CounterDisplay count={count} />
            <ButtonGroup />
        </div>
    );
};

export default Counter;
