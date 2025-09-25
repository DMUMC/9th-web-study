import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
} from 'react';
import type { TTodo } from '../types/todo';

interface TodoContextInterface {
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string) => void;
    handleCompleteTodo: (todo: TTodo) => void;
    handleDeleteTodo: (todo: TTodo) => void;
}

export const TodoContext = createContext<
    TodoContextInterface | undefined
>(undefined);

export const TodoProvider = ({
    children,
}: PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string): void => {
        const newTodo: TTodo = {
            id: Date.now(),
            text: text,
        };
        setTodos((prev): TTodo[] => [...prev, newTodo]);
    };

    const handleCompleteTodo = (todo: TTodo): void => {
        setTodos((prev) =>
            prev.filter((t) => t.id !== todo.id)
        );
        setDoneTodos((prev) => [...prev, todo]);
    };

    const handleDeleteTodo = (todo: TTodo): void => {
        setDoneTodos((prev) =>
            prev.filter((t) => t.id !== todo.id)
        );
    };

    return (
        <TodoContext.Provider
            value={{
                todos,
                doneTodos,
                addTodo,
                handleCompleteTodo,
                handleDeleteTodo,
            }}
        >
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);

    if (!context) {
        throw new Error(
            'useTodo 사용 시 TodoProvider로 감싸야 함'
        );
    }

    return context;
};
