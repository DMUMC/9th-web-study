import { useState } from 'react';

function CounterApp() {
    const [value, setValue] = useState(0);

    const incrementValue = () => {
        setValue(value + 1);
    };

    const decrementValue = () => {
        setValue(value - 1);
    };

    return (
        <>
            <h1>{value}</h1>
            <div>
                <button onClick={incrementValue}>+1 증가</button>
                <button onClick={decrementValue}>-1 감소</button>
            </div>
        </>
    );
}

export default CounterApp;
