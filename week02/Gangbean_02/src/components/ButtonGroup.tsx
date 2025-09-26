import { useCount } from '../context/CounterProvider';
import Button from './Button';

const ButtonGroup = () => {
    const { handleIncrease, handleDecrease } = useCount();

    return (
        <>
            <Button onClick={handleIncrease} text='증가' />
            <Button onClick={handleDecrease} text='감소' />
        </>
    );
};

export default ButtonGroup;
