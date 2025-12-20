import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
} from 'react';

interface CounterContextType {
    count: number;
    handleIncrease: () => void;
    handleDecrease: () => void;
}

export const CounterContext = createContext<
    CounterContextType | undefined
>(undefined);

export const CounterProvider = ({
    children,
}: PropsWithChildren) => {
    const [count, setCount] = useState(0);

    const handleIncrease = () => {
        setCount((prev) => prev + 1);
    };
    const handleDecrease = () => {
        setCount((prev) => prev - 1);
    };

    return (
        <CounterContext.Provider
            value={{
                count,
                handleIncrease,
                handleDecrease,
            }}
        >
            {children}
        </CounterContext.Provider>
    );
};

export const useCount = () => {
    const context = useContext(CounterContext);
    if (!context) {
        throw new Error(
            'useCount는 CountProvider 내부에서 사용해야 함'
        );
    }
    return context;
};
