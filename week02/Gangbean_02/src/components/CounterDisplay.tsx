import { useTheme } from '../context/ThemeProvider';
import clsx from 'clsx';

const CounterDisplay = ({ count }: { count: number }) => {
    const { theme } = useTheme();
    const isLightMode = theme === 'LIGHT';

    return (
        <h1
            className={clsx(
                'text-wxl font-bold',
                isLightMode ? 'text-black' : 'text-white'
            )}
        >
            누르면 숫자가 올라가요! {count}
        </h1>
    );
};

export default CounterDisplay;
