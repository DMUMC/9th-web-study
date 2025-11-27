import { useReducer, useState } from 'react';

interface IState {
    counter: number;
}

interface IAction {
    type: 'INCREASE' | 'DECREASE' | 'RESET';
}

const reducer = (state: IState, action: IAction) => {
    const { type } = action;
    switch (type) {
        case 'INCREASE':
            return {
                ...state,
                counter: state.counter + 1,
            };
        case 'DECREASE':
            return {
                ...state,
                counter: state.counter - 1,
            };
        case 'RESET':
            return {
                ...state,
                counter: 0,
            };
        default:
            return state;
    }
};

const UseReducerPage = () => {
    const [count, setCount] = useState(0);

    const [state, dispatch] = useReducer(reducer, {
        counter: 0,
    });

    const handleIncrease = () => {
        setCount(count + 1);
    };

    return (
        <>
            <h2>useState 사용: {count}</h2>
            <button onClick={handleIncrease}>
                Increase
            </button>
            <h2>useReducer 사용: {state.counter}</h2>
            <button
                onClick={() =>
                    dispatch({ type: 'INCREASE' })
                }
            >
                Increase
            </button>
            <button
                onClick={() =>
                    dispatch({ type: 'DECREASE' })
                }
            >
                Decrease
            </button>
            <button
                onClick={() => dispatch({ type: 'RESET' })}
            >
                Reset
            </button>
        </>
    );
};

export default UseReducerPage;
