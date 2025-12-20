import { useCallback, useState } from 'react';
import CountButton from '../components/CountButton';
import TextInput from '../components/TextInput';

export default function UseCallbackPage() {
    const [count, setCount] = useState<number>(0);
    const [text, setText] = useState<string>('');

    const handleIncreseCount = useCallback(
        (number: number) => {
            setCount(count + number);
        },
        [count]
    );

    const handleChangeText = useCallback(
        (text: string) => {
            setText(text);
        },
        [text]
    );

    return (
        <div>
            <h1>같이 배우는 리액트 useCallback편</h1>
            <h2>Count: {count}</h2>
            <CountButton onClick={handleIncreseCount} />
            <h2>Text: {text}</h2>
            <TextInput onChange={handleChangeText} />
        </div>
    );
}